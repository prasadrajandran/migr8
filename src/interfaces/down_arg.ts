export default interface DownArg {
  /**
   * Resolves to a value that will be passed to `Migr8.down()`.
   */
  (): Promise<void>;
}
