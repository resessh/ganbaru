import axios from 'axios';

const region = process.env.FIREBASE_REGION;
const projectName = process.env.FIREBASE_PROJECT_ID;
const appOrigin = `https://${region}-${projectName}.cloudfunctions.net`;

export const finishRegistration = async (
  slackId: string,
  spreadsheetId: string,
): Promise<string> => {
  const { data: messageLink } = await axios
    .post(`${appOrigin}/finishRegistration`, {
      slack_id: slackId,
      spreadsheet_id: spreadsheetId,
    })
    .catch(err => {
      throw new Error('Fail to finish registration.');
    });

  return messageLink as string;
};
