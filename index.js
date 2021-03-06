const fs                 = require('fs');
const lib_mongoDBBackup  = require('./mongodbBackup');
const lib_mongoDBRestore = require('mongodb-restore');
const lib_ajv            = require('ajv');

const globalConfigSchema = require('./config-schema.json');

class App {
  constructor(globalConfig) {
    if(!globalConfig) { throw new Error('A config must be passed to constructor'); }

    let ajv = new lib_ajv();
    ajv.addSchema(globalConfigSchema, 'configSchema');
    let isValid = ajv.validate('configSchema', globalConfig);

    if(!isValid) {
      throw new Error(ajv.errorsText());
    }
    
    this.globalConfig = globalConfig;

    this.checkConfig();
  }

  checkConfig() {
    if(this.globalConfig.origin.url.trim() === this.globalConfig.target.url.trim() && this.globalConfig.target.dbNameAppend.trim() === '') {
      throw new Error('When origin and target URLs are the same, a name must be appended to target DBs');
    }
  }

  async processBackup(config) {
    console.log('\n--- Starting backup process ---\n');
    try {
      fs.mkdirSync('./database');
    } catch(err) {
      if(err.code !== 'EEXIST') {
        throw err;
      }
    }
    
    if(!config.databases || config.databases.length === 0) {
      throw Error('At least one database must be specified');
    }

    for(let key in config.databases) {
      let dbName = config.databases[key];
  
      try {
        await this.backup(config, dbName);
        console.log(` - Database ${dbName} exported at ./database/${this.globalConfig.projectName}/${dbName}.tar`);
      } catch(err) {
        console.log('Error', err);
    
        if(err.message === 'not master and slaveOk=false') {
          console.log('Its mandatory to connect to the master server');
        }
  
        console.log('Backup process', 'Database "' + dbName + '" failed');
      }
    }
  
    console.log("\nBackup Done\n");
  }

  async processRestore(config, originDatabases) {
    console.log('\n--- Starting restore process ---\n');
    let databases;
    if(config.useOriginDatabases) {
      databases = originDatabases;
    } else {
      databases = config.databases;
    }

    for(let key in databases) {
      let dbName = databases[key];
  
      try {
        await this.restore(config, dbName, config.dbNameAppend.trim());
        console.log(` - Database ${dbName} restored as ${dbName + config.dbNameAppend}`);
      } catch(err) {
        console.log('Error', err);
    
        if(err.message === 'not master and slaveOk=false') {
          console.log('Its mandatory to connect to the master server');
        }
  
        console.log('Restore process', 'Database "' + dbName + '" failed');
      }
    }

    console.log("\nRestore Done\n");
  }

  async backup(config, dbName) {
    return new Promise((resolve, reject) => {
      if(!dbName || dbName === '') {
        reject(Error('A valid dbName must be provided'));
      }

      lib_mongoDBBackup({
        uri      : config.url + '/' + dbName,
        root     : './database/' + this.globalConfig.projectName,
        logger   : './log', // Doesn't seem to work :(
        options  : config.mongodbOptions,
        tar      : dbName + '.tar',
        callback : (err) => {
          err ? reject(err) : resolve()
          return;
        }
      });
    });
  }

  async restore(config, dbName, appendName) {
    return new Promise((resolve, reject) => {
      if(!dbName || dbName === '') {
        reject(Error('A valid dbName must be provided'));
      }

      lib_mongoDBRestore({
        uri      : config.url + '/' + dbName + appendName,
        root     : './database/' + this.globalConfig.projectName,
        tar      : dbName + '.tar',
        logger   : './log', // Doesn't seem to work :(
        options  : config.mongodbOptions,
        callback : (err) => {
          err ? reject(err) : resolve()
          return;
        }
      });
    });
  }
}

module.exports = (async (globalConfig) => {
  let AppInstance = new App(globalConfig);

  if(AppInstance.globalConfig.doBackup) {
    await AppInstance.processBackup(AppInstance.globalConfig.origin);
  }

  if(AppInstance.globalConfig.doRestore) {
    await AppInstance.processRestore(AppInstance.globalConfig.target, AppInstance.globalConfig.origin.databases);
  }

  console.log("--- Process finished ---\n");
});