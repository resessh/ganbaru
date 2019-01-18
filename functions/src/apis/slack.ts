import * as functions from 'firebase-functions';
import axios from 'axios';
import qs from 'qs';

const client = axios.create({
  baseURL: 'https://slack.com',
  headers: { Authorization: `Bearer ${functions.config().slack.token}` },
});

export const responseMessage = async (responseUrl: string, message: any) => {
  try {
    return await axios.post(responseUrl, message);
  } catch (err) {
    throw new Error('Slack API error: Failed to response message.');
  }
};

export const postMessage = async (channel: string, message: any) => {
  try {
    const { data } = await client.post('/api/chat.postMessage', {
      ...message,
      channel,
    });
    console.info('[slack api] postMessage', data);

    return data;
  } catch (err) {
    throw new Error('Slack API error: Failed to post ephemeral.');
  }
};

export const postEphemeral = async (
  channel: string,
  user: string,
  message: any,
) => {
  try {
    const { data } = await client.post('/api/chat.postEphemeral', {
      ...message,
      channel,
      user,
    });
    console.info('[slack api] postEphemeral', data);
    return data;
  } catch (err) {
    throw new Error('Slack API error: Failed to post ephemeral.');
  }
};

export const deleteMessage = async (
  channel: string,
  ts: string,
): Promise<void> => {
  const { data } = await client
    .post('/api/chat.delete', {
      channel,
      ts,
    })
    .catch(err => {
      throw new Error('Slack API error: Failed to delete message');
    });

  if (!data.ok) {
    throw new Error('Slack API error: Failed to delete message');
  }
  return;
};

export const fetchImChannel = async (user: string): Promise<string> => {
  try {
    const { data } = await client.post('/api/im.open', { user });

    return data.channel ? (data.channel.id as string) : '';
  } catch (err) {
    throw new Error('Slack API error: Failed to fetch IM channel');
  }
};

export const fetchPermalink = async (
  channel: string,
  message_ts: string,
): Promise<string> => {
  const query = qs.stringify({
    token: functions.config().slack.token,
    channel,
    message_ts,
  });

  const { data } = await axios.get(
    `https://slack.com/api/chat.getPermalink?${query}`,
  );

  if (!data.ok) {
    throw new Error('Slack API error: Failed to fetch permalink');
  }

  return data.permalink as string;
};
