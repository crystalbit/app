import usePersonalInfo from '@global/hooks/usePersonalInfo';

export const useActiveSignature = () => {
  let activeSignature = localStorage.getItem('activeSignature');
  const { address } = usePersonalInfo();

  const saveLocalStorage = (
    signature: string,
    data: string,
    address: string
  ) => {
    localStorage.setItem(
      'activeSignature',
      JSON.stringify({
        activeSignatureTime: {
          date: new Date().toLocaleString().split(', ')[0],
          time: new Date().toLocaleString().split(', ')[1],
          address,
          signature,
          dataSignMsg: data
        }
      })
    );
  };

  const timeDiffCalc = (dateFuture: any, dateNow: any) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;

    return { days, hours, minutes };
  };

  const setDifferenceTime = (landId: string, avatarId: string) => {
    if (!landId || !avatarId) return { flag: null };

    if (activeSignature === null) {
      return { flag: true };
    } else if (
      address !== JSON.parse(activeSignature).activeSignatureTime.address
    ) {
      return { flag: true };
    } else {
      const checkDifferentTime = JSON.parse(activeSignature);
      const { date, time, signature, dataSignMsg } =
        checkDifferentTime.activeSignatureTime;
      const nowDate: string =
        new Date()
          .toLocaleString()
          .split(', ')[0]
          .split('.')
          .reverse()
          .join('.') + `, ${new Date().toLocaleString().split(', ')[1]}`;
      const dateFeature: string = `${date
        .split('.')
        .reverse()
        .join('.')}, ${time}`;
      const { days, hours, minutes } = timeDiffCalc(
        new Date(dateFeature),
        new Date(nowDate)
      );

      if (days > 0) {
        return { flag: true };
      } else if (hours < 23 && hours === 0) {
        return { flag: false, signature, data: dataSignMsg };
      } else if (minutes < 55) {
        return { flag: false, signature, data: dataSignMsg };
      } else {
        return { flag: true, signature, data: dataSignMsg };
      }
    }
  };

  return { setDifferenceTime, saveLocalStorage };
};
