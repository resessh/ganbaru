import { HttpHandler } from '../../types';

const abortRegistration: HttpHandler = async (req, res) => {
  res.status(200).send({
    text: 'ホイ :tea:',
    replace_original: true,
  });
};

export default abortRegistration;
