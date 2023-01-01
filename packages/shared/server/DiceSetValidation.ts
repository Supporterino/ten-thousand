const isValidScoringSet = (arr: Array<number>) => {
  if (isStreet(arr)) return true;
  if (containsThreePairs(arr)) return true;
  if (onlyContainsOneAndFive(arr)) return true;
  if (checkMuliple(arr)) return true;
  return false;
};

const onlyContainsOneAndFive = (arr: Array<number>): boolean => {
  return arr.every((item) => item === 1 || item === 5);
};

const containsThreePairs = (arr: Array<number>): boolean => {
  const sorted = sortArray(arr);
  return sorted.length === 6 && sorted[0] === sorted[1] && sorted[2] === sorted[3] && sorted[4] === sorted[5];
};

const sortArray = (arr: Array<number>): Array<number> => {
  return arr.sort((n1, n2) => n1 - n2);
};

const isStreet = (arr: Array<number>): boolean => {
  return [1, 2, 3, 4, 5, 6].every((item) => arr.includes(item));
};

const checkMuliple = (arr: Array<number>): boolean => {
  const stripped = stripOnesAndFives(arr);
  const sorted = sortArray(stripped);

  if (sorted.every((item) => item === sorted[0]) && sorted.length >= 3) return true;
  if (sorted.length === 6) {
    const { arr1: multipleOne, arr2: multipleTwo } = splitIntoMultiples(sorted);
    if (multipleOne.every((item) => item === multipleOne[0]) && multipleTwo.every((item) => item === multipleTwo[0])) return true;
  }
  return false;
};

const splitIntoMultiples = (arr: Array<number>): { arr1: Array<number>; arr2: Array<number> } => {
  const sorted = sortArray(arr);
  return {
    arr1: sorted.slice(0, 2),
    arr2: sorted.slice(3, 5),
  };
};

const stripOnesAndFives = (arr: Array<number>): Array<number> => {
  return arr.filter((item) => item !== 1).filter((item) => item !== 5);
};

const calculateScore = (arr: Array<number>): number => {
  if (isStreet(arr)) return SCORING_VALUES.STREET;
  if (arr.length === 6 && containsThreePairs(arr)) return SCORING_VALUES.THREE_PAIRS;

  if (checkMuliple(arr)) {
    if (arr.length === 6) {
      const { arr1: multipleOne, arr2: multipleTwo } = splitIntoMultiples(arr);
      if (multipleOne[0] !== 1 && multipleTwo[0] !== 1) return (multipleOne[0] * 3 + multipleTwo[0] * 3) * SCORING_VALUES.MULTIPLE_BASE;
      else
        return 1000 + multipleOne[0] === 1
          ? multipleTwo[0] * 3 * SCORING_VALUES.MULTIPLE_BASE
          : multipleOne[0] * 3 * SCORING_VALUES.MULTIPLE_BASE;
    } else {
      let score = getOneAndFiveScore(arr);
      const stripped = stripOnesAndFives(arr);
      score += stripped[0] * stripped.length * SCORING_VALUES.MULTIPLE_BASE;
      return score;
    }
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
