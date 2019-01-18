import { HttpHandler } from '../../types';

import abortRegistration from './abortRegistration';
import abortInvalidEndingWork from './abortInvalidEndingWork';
import endWork from './endWork';

export enum ACTION_TYPES {
  REGISTRATION = 'REGISTRATION',
  END_WORK = 'END_WORK',
}

export const ACTION_VALUES = {
  [ACTION_TYPES.REGISTRATION]: {
    ABORT_REGISTRATION: 'ABORT_REGISTRATION',
  },
};

const actions: HttpHandler = async (req, res) => {
  const { callback_id: actionType, actions, user } = JSON.parse(
    req.body.payload,
  );

  if (
    actionType === ACTION_TYPES.REGISTRATION &&
    actions[0].value ===
      ACTION_VALUES[ACTION_TYPES.REGISTRATION].ABORT_REGISTRATION
  ) {
    await abortRegistration(req, res);
    return;
  }

  if (actionType === ACTION_TYPES.END_WORK && actions[0].value !== user.id) {
    await abortInvalidEndingWork(req, res);
    return;
  }

  if (actionType === ACTION_TYPES.END_WORK && actions[0].value === user.id) {
    await endWork(req, res);
    return;
  }
};

export default actions;
