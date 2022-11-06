import { LOCAL_STORAGE_KEYS } from '@global/constants';

export const splitArrToChunks = (arr: string[], size: number) =>
  arr.reduce(
    (acc, e, i) => (
      i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
    ),
    [] as Array<string[]>
  );

export const transformReferralAddress = (address: string) => {
  const chunks = splitArrToChunks(address.split(''), 8);

  const decodedChunks = chunks
    .map((i) => parseInt(i.join(''), 36).toString(16).padStart(10, '0'))
    .join('');

  localStorage.setItem(
    LOCAL_STORAGE_KEYS.referralAddress,
    `0x${decodedChunks}`
  );
};
