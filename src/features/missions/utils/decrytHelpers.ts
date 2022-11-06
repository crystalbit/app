export const LETTERS =
  'QWERTYUIOPASDFGHJKLZXCVBNM1234567890[]()<>{}\\|/!@#$%^&*';

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomLetter = (letters: string) => {
  return letters[getRandomInt(0, letters.length - 1)];
};

export const shuffle = <T>(array: T[]): T[] => {
  let arr = array;

  let currentIndex = arr.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex]
    ];
  }

  return arr;
};

export const getMultipleRandom = <T>(arr: Array<T>, num: number): Array<T> => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
};
