const parseOption = (
  args: string[],
  name: string,
  abbreviation: string = '',
  defaultValue: any = null,
) => {
  const rule = `--${name}|${abbreviation ? `-${abbreviation}` : ''}`;
  const pattern = new RegExp(rule);
  const arg = args.find((a) => pattern.test(a)) || '';
  return arg.split('=').pop() || defaultValue;
};

export default parseOption;
