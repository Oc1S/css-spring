export const compare = <T>(former: T, latter: T) => {
  if (Array.isArray(former) && Array.isArray(latter)) {
    if (former.length !== latter.length) return false;
    for (let i = 0; i < former.length; i++) {
      if (!compare(former[i], latter[i])) return false;
    }
    return true;
  }
  return former === latter;
};
