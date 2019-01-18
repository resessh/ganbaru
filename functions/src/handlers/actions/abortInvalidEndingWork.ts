import { postEphemeral } from '../../apis/slack';
import { COLORS } from '../../constants';
import { HttpHandler } from '../../types';

const abortInvalidEndingWork: HttpHandler = async (req, res) => {
  const { user, channel } = JSON.parse(req.body.payload);

  await postEphemeral(channel.id, user.id, {
    attachments: [
      {
        fallback: 'ダメでしょ？',
        color: COLORS.danger,
        image_url: 'https://pbs.twimg.com/media/C9DcqNUUwAAUEk2.jpg',
      },
    ],
  });

  res.status(200).send();
  return;
};

export default abortInvalidEndingWork;
