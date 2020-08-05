const findMaxStrLength = (values) => {
  return values.reduce(
    (max, v) => (String(v).length > max ? v.length : max),
    0,
  );
};

module.exports = findMaxStrLength;
