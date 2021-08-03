export interface FileSystemRegistryConstructor {
  /**
   * Directory to store the registry file. Defaults to the current working
   * directory.
   */
  registryDir?: string;

  /**
   * Filename (not including the path) of the registry file. Defaults to
   * 'migr8.registry.json'.
   */
  registryFilename?: string;
}
