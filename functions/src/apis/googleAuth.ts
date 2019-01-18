import * as functions from 'firebase-functions';
import qs from 'qs';
import axios from 'axios';

import { APP_ORIGIN } from '../constants';

interface authTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const fetchAuthTokens = async (code: string): Promise<authTokens> => {
  try {
    const { data } = await axios.post(
      'https://accounts.google.com/o/oauth2/token',
      qs.stringify({
        code,
        client_id: functions.config().google_app.id,
        client_secret: functions.config().google_app.secret,
        redirect_uri: `${APP_ORIGIN}/register`,
        grant_type: 'authorization_code',
      }),
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    );

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch (error) {
    console.error('Google API Error: Failed to fetch tokens.', error);

    return {
      accessToken: undefined,
      refreshToken: undefined,
    };
  }
};

export const fetchAccessToken = async (
  refreshToken: string,
): Promise<string> => {
  try {
    const { data } = await axios.post(
      'https://www.googleapis.com/oauth2/v4/token',
      qs.stringify({
        refresh_token: refreshToken,
        client_id: functions.config().google_app.id,
        client_secret: functions.config().google_app.secret,
        grant_type: 'refresh_token',
      }),
    );
    return data.access_token;
  } catch (err) {
    console.error('Google API Error: Failed to fetch tokens.', err);
    return '';
  }
};

export const fetchUserInfo = async (accessToken: string) => {
  try {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return data;
  } catch (err) {
    console.error('Google API Error: Failed to fetch user info.', err);
    return {};
  }
};
