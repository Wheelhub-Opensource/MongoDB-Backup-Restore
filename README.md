# MongoDB Backup & Restore
##### By: Wheelhub (http://www.wheelhub.es)

## Introduction 
This package has been created for the purpose of back up, restore and migration process of MongoDB databases.

I'ts based on two existing packages (mongodb-backup & mongodb-restore by hex7c0)

The main goal is to have an effective, developer friendly way to move data around by using a JSON configuration.

## Configuration
The package constructor requires a JSON object with the proper params in order to work.

#### Config schema
```json
{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "projectName",
    "doBackup",
    "doRestore",
    "origin",
    "target"
  ],
  "properties": {
    "projectName": {
      "type": "string",
      "description": "The name of the project to be backup"
    },
    "doBackup": {
      "type": "boolean",
      "description": "Tells if the package should run backup process or not"
    },
    "doRestore": {
      "type": "boolean",
      "description": "Tells if the package should run restore process or not"
    },
    "origin": {
      "type": "object",
      "required": [
        "url",
        "databases"
      ],
      "properties": {
        "url": {
          "type": "string",
          "description": "The MongoDB url to point to. Format: mongodb://user:password@hostname.com:27017"
        },
        "databases": {
          "type": "array",
          "description": "Names of databases to be backup",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "target": {
      "type": "object",
      "required": [
        "url",
        "useOriginDatabases",
        "databases",
        "dbNameAppend"
      ],
      "properties": {
        "url": {
          "type": "string",
          "description": "The MongoDB url to point to. Format: mongodb://user:password@hostname.com:27017"
        },
        "useOriginDatabases": {
          "type": "boolean",
          "description": "Tells if the package should use the same databases defined in origin. If so, target databases can be empty"
        },
        "databases": {
          "type": "array",
          "description": "Names of databases to be restored in case useOriginDatabases is false",
          "items": {
            "type": "string"
          }
        },
        "dbNameAppend": {
          "type": "string",
          "description": "Value to be appended after database names"
        }
      }
    }
  }
}
```

#### Example config
```js
{
  projectName: 'MyProject',
  doBackup: true,
  doRestore: true,
  origin: {
    url: 'mongodb://user:password@hostname.com:27017',
    databases: [],
    mongodbOptions: {
      ssl: true,
      authSource: 'admin'
    }
  },
  target: {
    url: 'mongodb://localhost:27017',
    mongodbOptions: {
      ssl: false
    },
    useOriginDatabases: true,
    databases: [],
    dbNameAppend: 'Copy'
  }
};
```


## Usage
Here's an example of how to use this package:
```js
const libMongodbBackupRestore = require('mongodb-backup-restore');

(async () => {

  let config = {
    projectName: 'MyProject',
    doBackup: true,
    doRestore: true,
    origin: {
      url: 'mongodb://user:password@hostname.com:27017',
      databases: [],
      mongodbOptions: {
        ssl: true,
        authSource: 'admin'
      }
    },
    target: {
      url: 'mongodb://localhost:27017',
      mongodbOptions: {
        ssl: false
      },
      useOriginDatabases: true,
      databases: [],
      dbNameAppend: 'Copy'
    }
  };
  try {
    await libMongodbBackupRestore(config); 
  } catch(err) {
    console.log(`--- Error: ${err.message} ---\n`);
  }
})();
```
If everything goes fine, the origin server database "myDatabase" will be backup and restored to target server with the name "myDatabaseCopy"

---