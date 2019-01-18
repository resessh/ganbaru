import { fetchUser } from '../../store/users';
import { HttpHandler } from '../../types';
import { postEphemeral } from '../../apis/slack';

import registerCommand from './register';
import ganbaruCommand from './ganbaru';

enum COMMAND_TYPE {
  register = 'register',
}

const slashHandler: HttpHandler = async (req, res) => {
  const {
    user_id: slackId,
    channel_id: channelId,
    text: commandType,
    command: commandName,
  } = req.body;

  if (commandType === COMMAND_TYPE.register) {
    console.info('[slash command] register');
    return await registerCommand(req, res);
  }

  const userInfo = await fetchUser(slackId);

  if (!userInfo.registeredMail || !userInfo.spreadsheetId) {
    console.info('[slash command] unknown user', slackId);
    await postEphemeral(channelId, slackId, {
      text: `誰…？ \`${commandName} register\` でユーザ登録するぞい！`,
    });
    res.status(200).send();
    return;
  }
  console.info('[slash command] ganbaru');
  return await ganbaruCommand(req, res);
};

export default slashHandler;
