import qs from 'qs';

import { HttpHandler } from '../types';
import { setUser, updateRegisteredMail } from '../store/users';
import { fetchAuthTokens, fetchUserInfo } from '../apis/googleAuth';

const register: HttpHandler = async (req, res) => {
  const { state, code } = req.query;

  if (!code) {
    res.status(404).send();
    return;
  }

  const { slackId, slackName } = qs.parse(state);
  const { accessToken, refreshToken } = await fetchAuthTokens(code);

  if (!accessToken) {
    res.status(500).send('あぼ〜ん');
    return;
  }

  const { email } = await fetchUserInfo(accessToken);

  if (refreshToken) {
    await setUser(
      slackId,
      {
        slackName,
        registeredMail: email,
      },
      {
        refreshToken,
      },
    );
  } else {
    // refresh token が無いということは過去認証済み
    await updateRegisteredMail(slackId, email);
  }

  const query = qs.stringify({
    slack_id: slackId,
    token: accessToken,
  });

  const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string);

  res
    .status(307)
    .redirect(
      `https://${projectId}.firebaseapp.com/pick-spreadsheet/?${query}`,
    );
};

export default register;
