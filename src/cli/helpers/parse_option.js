const parseOption = (args, name, abbreviation = '') => {
  const rule = `--${name}|${abbreviation ? `-${abbreviation}` : ''}`;
  const pattern = new RegExp(rule);
  const arg = args.find((a) => pattern.test(a)) || '';
  return arg.split('=').pop();
};

module.exports = parseOption;
