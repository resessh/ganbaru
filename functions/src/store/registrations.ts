import { db } from '../firebase';

const REGISTRATION_TABLE_KEY = 'registrations';

interface IRegistration {
  dmChannelId: string;
  messageTs: string;
  teamId: string;
}

const getRegistrationRef = (slackId: string) =>
  db.collection(REGISTRATION_TABLE_KEY).doc(slackId);

export const fetchRegistration = async (
  slackId: string,
): Promise<IRegistration> => {
  const registrationRef = getRegistrationRef(slackId);
  const registration = await registrationRef.get();
  if (registration.exists) {
    return registration.data() as IRegistration;
  }
  console.error('Store Error: No registration to fetch.');
  return {
    dmChannelId: '',
    messageTs: '',
    teamId: '',
  };
};

export const setRegistration = async (
  slackId: string,
  registration: IRegistration,
) => {
  const registrationRef = getRegistrationRef(slackId);
  await registrationRef.set(registration);
};

export const deleteRegistration = async (slackId: string) => {
  const registrationRef = getRegistrationRef(slackId);
  await registrationRef.delete();
};
