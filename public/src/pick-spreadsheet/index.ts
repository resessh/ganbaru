import './style.scss';

import Vue from 'vue';
import LoadingImage from './components/LoadingImage.vue';

import { pickSpreadSheet } from './apis/picker';
import { finishRegistration } from './apis/functions';

new Vue({
  render: h => h(LoadingImage),
}).$mount('#loading');

const PICKER_DEVELOPER_KEY = process.env.FIREBASE_API_KEY;

const slackId = new URLSearchParams(document.location.search).get('slack_id');
const accessToken = new URLSearchParams(document.location.search).get('token');

window.addEventListener('DOMContentLoaded', async () => {
  if (!PICKER_DEVELOPER_KEY || !slackId || !accessToken) return;

  const { id: spreadsheetId } = await pickSpreadSheet(
    PICKER_DEVELOPER_KEY,
    accessToken,
  );

  const permalink = await finishRegistration(slackId, spreadsheetId);
  location.replace(permalink);
});
