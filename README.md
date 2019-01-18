# Ganbaru
Save working log to slack and spreadsheet.

## Setup
1. Clone Source
2. Create Firebase project
3. Modify OAuth2.0 client for Google API.
    - Add redirect URI
    - Create another one for server-side client

4. Install Firebase CLI

    https://firebase.google.com/docs/cli/

5. Set envs

    ```sh
    $ firebase functions:config:set \
      slack.token="<slack_token>" \
      google_app.id="<google_app_client_id_for_server_side>" \
      google_app.secret="<google_app_client_secret_for_server_side>" \
      functions.region="use-central1"
    ```

6. yarn install
    - both of /public and /functions
7. Serve it!

    ```sh
    $ firebase deploy
    ```

8. Create Slack Commands and Interactive Components settings.
    - add an command and set Request URL as `<functions-origin>/slash`
    - add Request URL of Interactivity as `<functions-origin>/actions`

## License
MIT
