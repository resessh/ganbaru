import axios from 'axios';
import qs from 'qs';

const spreadsheetApiUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

export const fetchLastRowIndex = async (
  accessToken: string,
  spreadsheetId: string,
): Promise<number> => {
  let lastRowIndex: number;
  try {
    const { data } = await axios.get(
      `${spreadsheetApiUrl}/${spreadsheetId}/values/A:D`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    lastRowIndex = parseInt(data.values.length, 10);
  } catch (err) {
    console.error(err);
    throw new Error('Spreadsheet API error: Failed to fetch last row.');
  }

  return lastRowIndex;
};

export const appendStartTimeRow = async (
  accessToken: string,
  spreadsheetId: string,
  { now, slackUrl }: { now: string; slackUrl: string },
) => {
  const rowIndex = (await fetchLastRowIndex(accessToken, spreadsheetId)) + 1;

  const query = qs.stringify({
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
  });

  try {
    await axios.post(
      `${spreadsheetApiUrl}/${spreadsheetId}/values/A${rowIndex}:D${rowIndex}:append?${query}`,
      {
        majorDimension: 'ROWS',
        values: [[now, now, `=B${rowIndex}-A${rowIndex}`, slackUrl]],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (err) {
    console.error(err);
    throw new Error('Spreadsheet API error: Failed to append start time row.');
  }
};

export const appendEndTime = async (
  accessToken: string,
  spreadsheetId: string,
  { now }: { now: string },
) => {
  const rowIndex = await fetchLastRowIndex(accessToken, spreadsheetId);

  const query = qs.stringify({
    valueInputOption: 'USER_ENTERED',
  });

  try {
    await axios.put(
      `${spreadsheetApiUrl}/${spreadsheetId}/values/B${rowIndex}:B${rowIndex}?${query}`,
      {
        majorDimension: 'ROWS',
        values: [[now]],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (err) {
    console.error(err);
    throw new Error('Spreadsheet API error: Failed to append end time row.');
  }
};
