import * as functions from 'firebase-functions';
import { format } from 'date-fns';
import { ACTION_TYPES } from '../actions';
import { fetchUser, fetchRefreshToken } from '../../store/users';
import { setGanbari, fetchGanbari } from '../../store/ganbari';
import { postMessage, postEphemeral, fetchPermalink } from '../../apis/slack';
import { fetchAccessToken } from '../../apis/googleAuth';
import { appendStartTimeRow } from '../../apis/spreadsheet';
import { getGanbariImage } from '../../utils/images';
import { COLORS, DISPLAYING_DATETIME_FORMAT } from '../../constants';
import { HttpHandler } from '../../types';

const handleGanbariExists = async (
  {
    channelId,
    messageTs,
    slackId,
  }: { channelId: string; messageTs: string; slackId: string },
  res: functions.Response,
) => {
  const permalink = await fetchPermalink(channelId, messageTs);

  await postEphemeral(channelId, slackId, {
    text: 'もうがんばってるぞい？',
    attachments: [
      {
        fallback: '？',
        text: `${permalink}`,
        color: COLORS.normal,
      },
    ],
  });
};

const startGanbari: HttpHandler = async (req, res) => {
  const { user_id: slackId, channel_id: channelId } = req.body;

  const { spreadsheetId, registeredMail } = await fetchUser(slackId);
  const refreshToken = await fetchRefreshToken(slackId, registeredMail);

  if (!refreshToken || !spreadsheetId) {
    await postMessage(channelId, {
      text: 'ち〜ん :tea:',
    });
    return;
  }

  const accessToken = await fetchAccessToken(refreshToken);
  const now = format(new Date(), DISPLAYING_DATETIME_FORMAT);
  const { ts: messageTs } = await postMessage(channelId, {
    response_type: 'in_channel',
    attachments: [
      {
        text: `<@${slackId}> おしごとはじめるぞい！`,
        image_url: getGanbariImage(new Date()),
        color: COLORS.aoba,
        fields: [
          {
            title: '始業時刻',
            value: now,
            short: true,
          },
        ],
      },
      {
        fallback: 'Log your work finishing at spreadsheet.',
        text: 'おしごとおわったら押すぞい！',
        callback_id: ACTION_TYPES.END_WORK,
        color: COLORS.danger,
        attachment_type: 'default',
        actions: [
          {
            name: 'finish',
            value: slackId,
            type: 'button',
            text: '退勤ぞい！',
            style: 'danger',
          },
        ],
      },
    ],
  });

  const slackUrl = await fetchPermalink(channelId, messageTs);
  await Promise.all([
    await appendStartTimeRow(accessToken, spreadsheetId, {
      now,
      slackUrl,
    }),
    await setGanbari(slackId, {
      channelId,
      messageTs,
    }),
  ]);
};

const ganbaruHandler: HttpHandler = async (req, res) => {
  const { user_id: slackId } = req.body;

  res.status(200).send();

  const { channelId, messageTs } = await fetchGanbari(slackId);
  if (channelId && messageTs) {
    await handleGanbariExists({ slackId, channelId, messageTs }, res);
    return;
  }

  await startGanbari(req, res);
  return;
};

export default ganbaruHandler;
