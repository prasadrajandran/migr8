export default interface UpArg {
  /**
   * Resolves to a value that will be passed to `Migr8.up()`.
   */
  (): Promise<any>;
}
