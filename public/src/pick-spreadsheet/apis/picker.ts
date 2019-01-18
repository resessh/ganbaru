const loadPickerApi = (gapi: any) => {
  return new Promise(resolve => {
    gapi.load('picker', function() {
      resolve();
    });
  });
};

const pickDocFromPicker = (
  google: any,
  developerKey: string,
  accessToken: string,
) => {
  return new Promise(resolve => {
    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.SPREADSHEETS)
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .setOAuthToken(accessToken)
      .setDeveloperKey(developerKey)
      .setCallback(({ action, docs }: { action: string; docs: object[] }) => {
        if (action !== 'picked') {
          return;
        }

        resolve(docs[0]);
      })
      .build();

    picker.setVisible(true);
  });
};

export const pickSpreadSheet = async (
  developerKey: string,
  accessToken: string,
): Promise<any> => {
  await loadPickerApi((window as any).gapi);
  return await pickDocFromPicker(
    (window as any).google,
    developerKey,
    accessToken,
  );
};
