const parseOption = (args, name, abbreviation = '', defaultValue = null) => {
  const rule = `--${name}|${abbreviation ? `-${abbreviation}` : ''}`;
  const pattern = new RegExp(rule);
  const arg = args.find((a) => pattern.test(a)) || '';
  return arg.split('=').pop() || defaultValue;
};

module.exports = parseOption;
