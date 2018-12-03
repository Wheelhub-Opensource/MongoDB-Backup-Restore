const libPackage = require('./../index');

test('Sending a valid object to constructor should pass validation. Should fail because origin and target URLs are identical, therefore a dbNameAppend must be filled', async () => {
  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: {
      url: '',
      mongodbOptions: {},
      databases: []
    },
    target: {
      url: '',
      mongodbOptions: {},
      useOriginDatabases: true,
      databases: [],
      dbNameAppend: ''
    }
  })).rejects.toEqual(new Error(`When origin and target URLs are the same, a name must be appended to target DBs`));
});

test('Sending a valid object to constructor should pass validation', async () => {
  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: {
      url: '',
      mongodbOptions: {},
      databases: []
    },
    target: {
      url: '',
      mongodbOptions: {},
      useOriginDatabases: true,
      databases: [],
      dbNameAppend: 'Copy'
    }
  })).resolves.toEqual(undefined);
});