const findMaxStrLength = (values) => {
  return values.reduce((max, v) => {
    const str = String(v);
    return str.length > max ? str.length : max;
  }, 0);
};

module.exports = findMaxStrLength;
