import * as functions from 'firebase-functions';

export type HttpHandler = (
  req: functions.Request,
  res: functions.Response,
) => void | Promise<void>;
