const findMaxStrLength = (values: any[]) => {
  return values.reduce((max: number, v) => {
    const str = String(v);
    return str.length > max ? str.length : max;
  }, 0);
};

export default findMaxStrLength;
