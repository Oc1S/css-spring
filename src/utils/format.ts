export const toPercent = (num: number) => `${(num * 100).toFixed(0)}%`;

export const formatNumber = (num: number) => {
  return +num.toFixed(2);
};
