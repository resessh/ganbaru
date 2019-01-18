import { format } from 'date-fns';
import { fetchUser, fetchRefreshToken } from '../../store/users';
import { deleteGanbari } from '../../store/ganbari';
import { postMessage } from '../../apis/slack';
import { fetchAccessToken } from '../../apis/googleAuth';
import { appendEndTime } from '../../apis/spreadsheet';
import { COLORS, DISPLAYING_DATETIME_FORMAT } from '../../constants';
import { HttpHandler } from '../../types';

const abortInvalidEndingWork: HttpHandler = async (req, res) => {
  const {
    user,
    channel,
    message_ts: messageTs,
    original_message: originalMessage,
  } = JSON.parse(req.body.payload);

  res.status(200).send({
    response_type: 'in_channel',
    attachments: [originalMessage.attachments[0]],
  });

  const now = format(new Date(), DISPLAYING_DATETIME_FORMAT);
  const { spreadsheetId, registeredMail } = await fetchUser(user.id);
  const refreshToken = await fetchRefreshToken(user.id, registeredMail);

  if (!refreshToken || !spreadsheetId) {
    res.status(200).send({
      replace_original: false,
      text: 'あぼ〜ん',
    });
    return;
  }

  await Promise.all([
    await postMessage(channel.id, {
      text: 'あがりまーす',
      attachments: [
        {
          text: '退勤したぞい！',
          color: COLORS.good,
          image_url:
            'http://blog-imgs-64.fc2.com/y/a/r/yaraon/Bv1rXX3IEAA3bKq_20141001212717d1c.jpg',
          fields: [
            {
              title: '退勤時刻',
              value: now,
              short: true,
            },
          ],
        },
      ],
      reply_broadcast: true,
      thread_ts: messageTs,
    }),
    (async () => {
      const accessToken = await fetchAccessToken(refreshToken);
      await appendEndTime(accessToken, spreadsheetId, { now });
    })(),
    await deleteGanbari(user.id),
  ]);

  return;
};

export default abortInvalidEndingWork;
