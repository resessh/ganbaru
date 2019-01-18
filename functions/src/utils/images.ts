import { isWeekend } from 'date-fns';

enum IMAGES {
  ganbaru = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUVpWw9A1QMl5iniM9aMfkTQNJNp8Kv0uZ--xg-rfmAXq0tl8a',
  workingWeekend = 'https://pbs.twimg.com/media/CoYULavUEAAxdEo.jpg',
  nothingHoliday = 'https://66.media.tumblr.com/3b484579d572e349f03ac5f8f2c9e4af/tumblr_naokwa7AN01rk8zp8o3_250.png',
}

const WeekEndLotteryTable = [
  IMAGES.workingWeekend,
  IMAGES.nothingHoliday,
  ...Array(18).fill(IMAGES.ganbaru),
];

export const getGanbariImage = (date: Date) => {
  if (!isWeekend(date)) {
    return IMAGES.ganbaru;
  }
  const resultIndex = Math.round(WeekEndLotteryTable.length * Math.random());

  return WeekEndLotteryTable[resultIndex];
};
