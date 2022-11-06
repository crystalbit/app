import md5 from 'md5';

type Seconds = number;

const stringToIntHash = (
  str: string,
  lowerbound: number,
  upperbound: number
): number => {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result + str.charCodeAt(i);
  }
  return (result % (upperbound - lowerbound)) + lowerbound;
};

export const timeToDayHourInSeconds = (hour: number): Seconds => {
  let hourTime = new Date();
  hourTime.setHours(hour);
  hourTime.setMinutes(0);
  hourTime.setSeconds(0);
  hourTime.setMilliseconds(0);
  const result = Math.round((hourTime.getTime() - new Date().getTime()) / 1000);
  return result < 0 ? result + 60 * 60 * 24 : result;
};

export const timeToMidnightInSeconds = (): Seconds => {
  return timeToDayHourInSeconds(24);
};

export const timeToLandMissionsLimitsReset = (landId: number): any => {
  let date = new Date(0);
  date.setSeconds(
    timeToDayHourInSeconds(stringToIntHash(md5(landId.toString()), 1, 24))
  );
  return {
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds()
  };
};
