const libMongodbBackupRestore = require('./index');

(async () => {

  let config = {
    projectName: 'MyProject',
    doBackup: false,
    doRestore: false,
    origin: {
      url: '',
      databases: []
    },
    target: {
      url: '',
      useOriginDatabases: false,
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