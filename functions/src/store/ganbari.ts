import { db } from '../firebase';

const GANBARI_TABLE_KEY = 'ganbaris';

interface IGanbari {
  channelId: string;
  messageTs: string;
}

const getGanbariRef = (slackId: string) =>
  db.collection(GANBARI_TABLE_KEY).doc(slackId);

export const setGanbari = async (slackId: string, ganbari: IGanbari) => {
  const ganbariRef = getGanbariRef(slackId);
  await ganbariRef.set(ganbari);
};

export const fetchGanbari = async (slackId: string): Promise<IGanbari> => {
  const ganbariRef = getGanbariRef(slackId);
  const ganbari = await ganbariRef.get();

  if (!ganbari.exists) {
    return {
      channelId: '',
      messageTs: '',
    };
  }

  return ganbari.data() as IGanbari;
};

export const deleteGanbari = async (slackId: string) => {
  const ganbariRef = getGanbariRef(slackId);
  await ganbariRef.delete();
};
