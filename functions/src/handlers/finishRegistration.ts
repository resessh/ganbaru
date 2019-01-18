import { fetchRegistration, deleteRegistration } from '../store/registrations';
import { HttpHandler } from '../types';
import { deleteMessage, postMessage, fetchPermalink } from '../apis/slack';
import { updateSpreadsheetId } from '../store/users';

const finishRegistration: HttpHandler = async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-type');

  if (req.method.toUpperCase() === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  const { slack_id: slackId, spreadsheet_id: spreadsheetId } = req.body;

  if (!slackId) {
    res.status(404).send('ない〜ん');
    return;
  }

  const { dmChannelId, messageTs } = await fetchRegistration(slackId);

  if (!dmChannelId || !messageTs) {
    res.status(404).send('ない〜ん');
    return;
  }

  try {
    await Promise.all([
      await updateSpreadsheetId(slackId, spreadsheetId),
      await deleteMessage(dmChannelId, messageTs),
      await deleteRegistration(slackId),
    ]);
  } catch (err) {
    console.error(err);
  }

  const { ts: finishMessageTs } = await postMessage(dmChannelId, {
    text: '登録したぞい！',
  });

  const permalink = await fetchPermalink(dmChannelId, finishMessageTs);

  res.header('content-type', 'text/plain');
  res.status(200).send(permalink);
};

export default finishRegistration;
