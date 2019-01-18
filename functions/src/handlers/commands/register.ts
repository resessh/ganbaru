import * as functions from 'firebase-functions';
import qs from 'qs';

import { setRegistration } from '../../store/registrations';
import { HttpHandler } from '../../types';
import { ACTION_TYPES, ACTION_VALUES } from '../actions';
import { COLORS, APP_ORIGIN } from '../../constants';
import { fetchImChannel, postMessage, postEphemeral } from '../../apis/slack';

const register: HttpHandler = async (req, res) => {
  const {
    user_id: slackId,
    user_name: slackName,
    team_id: teamId,
    channel_id: channelId,
  } = req.body;

  res.status(200).send();

  const googleAuthUrlParams = qs.stringify({
    scope: [
      'email',
      'profile',
      'openid',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets',
    ].join(' '),
    access_type: 'offline',
    include_granted_scopes: true,
    state: qs.stringify({
      slackId,
      slackName,
    }),
    redirect_uri: `${APP_ORIGIN}/register`,
    response_type: 'code',
    client_id: functions.config().google_app.id,
  });
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googleAuthUrlParams}`;

  const dmChannelId = await fetchImChannel(slackId);

  await Promise.all([
    (async () => {
      if (channelId !== dmChannelId) {
        await postEphemeral(channelId, slackId, {
          text: `<@${slackId}> DM送ったから見るぞい！`,
        });
      }
    })(),
    (async () => {
      const { ts: messageTs } = await postMessage(dmChannelId, {
        text:
          'アカウントを登録するぞい。記録するスプレッドシートを事前に作っておくぞい！',
        attachments: [
          {
            fallback: `Register account from ${googleAuthUrl}`,
            callback_id: ACTION_TYPES.REGISTRATION,
            color: COLORS.normal,
            attachement_type: 'default',
            actions: [
              {
                name: 'continue',
                type: 'button',
                text: '作ったので登録するぞい！',
                url: googleAuthUrl,
                style: 'primary',
              },
              {
                name: 'abort',
                type: 'button',
                text: 'やめるぞい…',
                value:
                  ACTION_VALUES[ACTION_TYPES.REGISTRATION].ABORT_REGISTRATION,
              },
            ],
          },
        ],
      });

      if (!messageTs) {
        await postEphemeral(channelId, slackId, {
          text: 'なんかだめっぽい',
        });
        return;
      }

      try {
        await setRegistration(slackId, {
          dmChannelId,
          messageTs,
          teamId,
        });
      } catch (err) {
        console.error(err);
      }
    })(),
  ]);

  return;
};

export default register;
