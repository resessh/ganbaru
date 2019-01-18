import * as functions from 'firebase-functions';
const region = functions.config().functions.region;
const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG as string);
export const APP_ORIGIN = `https://${region}-${projectId}.cloudfunctions.net`;

export enum COLORS {
  aoba = '#bcb5f2',
  primary = '#439FE0',
  good = '#74c79d',
  danger = '#d52e43',
  normal = '#c6c6c6',
}

export const DISPLAYING_DATETIME_FORMAT = 'YYYY/M/D H:m:s';
