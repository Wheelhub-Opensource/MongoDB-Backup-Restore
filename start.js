const libMongodbBackupRestore = require('./index');

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
    console.log(err);
    console.log(`--- Error: ${err.message} ---\n`);
  }
})();