import { db } from '../firebase';

const USER_TABLE_KEY = 'users';
const AUTH_COLLECTION_KEY = 'auths';

interface IUserInfo {
  slackName: string;
  registeredMail: string;
  spreadsheetId?: string;
}

interface IUserAuth {
  refreshToken: string;
}

const getUserRef = (slackId: string) =>
  db.collection(USER_TABLE_KEY).doc(slackId);

export const fetchUser = async (slackId: string): Promise<IUserInfo> => {
  const user = await getUserRef(slackId).get();
  if (user.exists) {
    return user.data() as IUserInfo;
  }
  console.error('Store Error: No user to fetch.');
  return {
    slackName: '',
    registeredMail: '',
    spreadsheetId: '',
  };
};

export const fetchRefreshToken = async (
  slackId: string,
  registeredMail: string,
) => {
  const authRef = getUserRef(slackId)
    .collection(AUTH_COLLECTION_KEY)
    .doc(registeredMail);
  const auth = await authRef.get();
  if (!auth.exists) {
    console.error('Store Error: No such auth.');
    return '';
  }

  return (auth.data() as IUserAuth).refreshToken;
};

export const setUser = async (
  slackId: string,
  user: IUserInfo,
  auth?: IUserAuth,
) => {
  const userRef = getUserRef(slackId);
  await userRef.set(user);
  if (!auth) return;
  await userRef
    .collection(AUTH_COLLECTION_KEY)
    .doc(user.registeredMail)
    .set(auth);
};

export const updateRegisteredMail = async (
  slackId: string,
  registeredMail: string,
) => {
  const userRef = getUserRef(slackId);

  if (!(await userRef.get()).exists) {
    console.error('Store Error: No user to update registered mail');
    return;
  }

  userRef.update({
    registeredMail,
  });
};

export const updateSpreadsheetId = async (
  slackId: string,
  spreadsheetId: string,
) => {
  const userRef = getUserRef(slackId);

  if (!(await userRef.get()).exists) {
    console.error('Store Error: No user to update spreadsheet id');
    return;
  }

  userRef.update({
    spreadsheetId,
  });
};
