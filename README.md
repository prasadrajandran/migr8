# migr8

Agnostic migration utility.

## How Do I Use It?

### Documentation

- CLI [man](https://raw.githubusercontent.com/prasadrajandran/migr8/master/src/man_pages/man.txt)
  page.
- Full API documentation can be found [here](https://github.com/prasadrajandran/migr8/tree/master/docs).
  These are the most relevant bits:
  - [Migr8Config](https://github.com/prasadrajandran/migr8/blob/master/docs/interfaces/interfaces_migr8_config.Migr8Config.md)
    - Interface of the config file.
  - [Migr8](https://github.com/prasadrajandran/migr8/blob/master/docs/classes/migr8.Migr8.md)
    - Migr8 class. Inherit this class if there's a need to reimplement any of
      its methods.
  - [Registry](https://github.com/prasadrajandran/migr8/blob/master/docs/interfaces/interfaces_registry.Registry.md)
    - Registry driver interface. Implement this interface if there's a need to
      create another driver (i.e. to support MySQL, PostgreSQL, etc.).
  - [FileSystemRegistry](https://github.com/prasadrajandran/migr8/blob/master/docs/classes/registry_drivers_file_system_registry.FileSystemRegistry.md)
    - Default file system driver that is included out of the box.

### Installation

Locally:

```
npm install @prasadrajandran/migr8

npx migr8 [command]
```

Globally:

```
npm install -g @prasadrajandran/migr8

migr8 [command]
```
