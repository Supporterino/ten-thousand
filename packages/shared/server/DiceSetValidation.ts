const isValidScoringSet = (arr: Array<number>) => {
  if (isStreet(arr)) return true;
  if (containsThreePairs(arr)) return true;
  if (checkMuliple(arr)) return true;
  if (onlyContainsOneAndFive(arr)) return true;
  return false;
};

const onlyContainsOneAndFive = (arr: Array<number>): boolean => {
  return arr.every((item) => item === 1 || item === 5);
};

const containsThreePairs = (arr: Array<number>): boolean => {
  const sorted = sortArray(arr);
  return (
    sorted.length === 6 &&
    sorted[0] === sorted[1] &&
    sorted[2] === sorted[3] &&
    sorted[4] === sorted[5] &&
    sorted[0] !== sorted[2] &&
    sorted[0] !== sorted[4] &&
    sorted[2] !== sorted[4]
  );
};

const sortArray = (arr: Array<number>): Array<number> => {
  return arr.sort((n1, n2) => n1 - n2);
};

const isStreet = (arr: Array<number>): boolean => {
  return [1, 2, 3, 4, 5, 6].every((item) => arr.includes(item));
};

const checkMuliple = (arr: Array<number>): boolean => {
  let isMultiple = false;
  [0, 1, 2, 3, 4, 5, 6].forEach((toCheck) => {
    if (arr.filter((item) => item === toCheck).length >= 3) isMultiple = true;
  });

  return isMultiple;
};

const calculateScore = (arr: Array<number>): number => {
  if (isStreet(arr)) return SCORING_VALUES.STREET;
  if (arr.length === 6 && containsThreePairs(arr)) return SCORING_VALUES.THREE_PAIRS;

  if (checkMuliple(arr)) {
    const numbers = {
      1: arr.filter((item) => item === 1),
      2: arr.filter((item) => item === 2),
      3: arr.filter((item) => item === 3),
      4: arr.filter((item) => item === 4),
      5: arr.filter((item) => item === 5),
      6: arr.filter((item) => item === 6),
    };

    return (
      (numbers[1].length >= 3 ? 1000 * (numbers[1].length - 2) : numbers[1].length * 100) +
      (numbers[2].length >= 3 ? SCORING_VALUES.MULTIPLE_BASE * 2 * (numbers[2].length - 2) : 0) +
      (numbers[3].length >= 3 ? SCORING_VALUES.MULTIPLE_BASE * 3 * (numbers[3].length - 2) : 0) +
      (numbers[4].length >= 3 ? SCORING_VALUES.MULTIPLE_BASE * 4 * (numbers[4].length - 2) : 0) +
      (numbers[5].length >= 3 ? SCORING_VALUES.MULTIPLE_BASE * 5 * (numbers[5].length - 2) : numbers[5].length * 50) +
      (numbers[6].length >= 3 ? SCORING_VALUES.MULTIPLE_BASE * 6 * (numbers[6].length - 2) : 0)
    );
  }

  return getOneAndFiveScore(arr);
};

const getOneAndFiveScore = (arr: Array<number>): number => {
  let score = 0;
  arr.forEach((item) => {
    if (item === 1) score += 100;
    if (item === 5) score += 50;
  });
  return score;
};

const enum SCORING_VALUES {
  STREET = 2500,
  THREE_PAIRS = 1000,
  MULTIPLE_BASE = 100,
}

export { isValidScoringSet, calculateScore };
