export const parseCommands = (
  args: string[],
  ...names: string[]
): { name: string; value: string } => {
  const pattern = new RegExp(names.join('|'));
  const arg = args.find((a) => pattern.test(a)) || '';
  const [name, value] = arg.split('=');
  return { name, value };
};
