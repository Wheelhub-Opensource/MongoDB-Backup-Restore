const lib_mongoDBBackup  = require('mongodb-backup');
const lib_mongoDBRestore = require('mongodb-restore');

const globalConfig      = require('./config.json');

class App {
  constructor() { }

  async processBackup(config) {
    if(!config.databases || config.databases.length === 0) {
      throw Error();
    }

    for(let key in config.databases) {
      let dbName = config.databases[key];
  
      try {
        await this.backup(config.url, dbName);
        console.log('Database "' + dbName + '" exported');
      } catch(err) {
        console.log('Error', err);
    
        if(err.message === 'not master and slaveOk=false') {
          console.log('Its mandatory to connect to the master server');
        }
  
        console.log('Backup process', 'Database "' + dbName + '" failed');
      }
    }
  
    console.log("\nBackup Done!");
  }

  async processRestore(config, originDatabases) {
    let databases;
    if(config.useOriginDatabases) {
      databases = originDatabases;
    } else {
      databases = config.databases;
    }

    for(let key in databases) {
      let dbName = databases[key];
  
      try {
        await this.restore(config.url, dbName, config.dbNameAppend);
        console.log('Database "' + dbName + '" restored');
      } catch(err) {
        console.log('Error', err);
    
        if(err.message === 'not master and slaveOk=false') {
          console.log('Its mandatory to connect to the master server');
        }
  
        console.log('Restore process', 'Database "' + dbName + '" failed');
      }
    }

    console.log("\nRestore Done!");
  }

  async backup(url, dbName) {
    return new Promise((resolve, reject) => {
      if(!dbName || dbName === '') {
        reject(Error('A valid dbName must be provided'));
      }

      lib_mongoDBBackup({
        uri      : url + '/' + dbName,
        root     : './database/' + globalConfig.projectName,
        logger   : './log', // Doesn't seem to work :(
        options  : { ssl : true, authSource : 'admin' },
        tar      : dbName + '.tar',
        callback : (err) => {
          err ? reject(err) : resolve()
          return;
        }
      });
    });
  }

  async restore(url, dbName, appendName) {
    return new Promise((resolve, reject) => {
      if(!dbName || dbName === '') {
        reject(Error('A valid dbName must be provided'));
      }

      lib_mongoDBRestore({
        uri      : url + '/' + dbName + appendName,
        root     : './database/' + globalConfig.projectName,
        tar      : dbName + '.tar',
        logger   : './log', // Doesn't seem to work :(
        options  : { ssl : true, authSource : 'admin' },
        callback : (err) => {
          err ? reject(err) : resolve()
          return;
        }
      });
    });
  }
}

(async () => {
  let AppInstance = new App();

  if(globalConfig.doBackup) {
    await AppInstance.processBackup(globalConfig.origin);
  }

  if(globalConfig.doRestore) {
    await AppInstance.processRestore(globalConfig.target, globalConfig.origin.databases);
  }

  console.log("--- Process finished ---");
})();