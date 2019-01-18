import * as functions from 'firebase-functions';
import 'firebase-functions';

const region = functions.config().functions.region;

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'slash') {
  exports.slash = functions
    .region(region)
    .https.onRequest(require('./handlers/commands').default);
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'actions') {
  exports.actions = functions
    .region(region)
    .https.onRequest(require('./handlers/actions').default);
}
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'register') {
  exports.register = functions
    .region(region)
    .https.onRequest(require('./handlers/register').default);
}
if (
  !process.env.FUNCTION_NAME ||
  process.env.FUNCTION_NAME === 'finishRegistration'
) {
  exports.finishRegistration = functions
    .region(region)
    .https.onRequest(require('./handlers/finishRegistration').default);
}
