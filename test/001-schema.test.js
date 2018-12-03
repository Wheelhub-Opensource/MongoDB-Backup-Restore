const libPackage = require('./../index');

test('Sending no param to constructor must fail', async () => {
  await expect(libPackage()).rejects.toEqual(new Error('A config must be passed to constructor'));
});

test('Sending anything different than an object to constructor must fail', async () => {
  await expect(libPackage(`I'm an innocent string.`)).rejects.toEqual(new Error('data should be object'));
  await expect(libPackage(123)).rejects.toEqual(new Error('data should be object'));
  await expect(libPackage(true)).rejects.toEqual(new Error('data should be object'));
  await expect(libPackage(false)).rejects.toEqual(new Error('A config must be passed to constructor'));
});

test('Sending invalid object to constructor must fail', async () => {
  await expect(libPackage({})).rejects.toEqual(new Error(`data should have required property 'projectName'`));

  await expect(libPackage({
    projectName: 123
  })).rejects.toEqual(new Error(`data.projectName should be string`));

  await expect(libPackage({
    projectName: 'TestSuite'
  })).rejects.toEqual(new Error(`data should have required property 'doBackup'`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: 'yes'
  })).rejects.toEqual(new Error(`data.doBackup should be boolean`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false
  })).rejects.toEqual(new Error(`data should have required property 'doRestore'`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false
  })).rejects.toEqual(new Error(`data should have required property 'origin'`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: false
  })).rejects.toEqual(new Error(`data.origin should be object`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: {}
  })).rejects.toEqual(new Error(`data.origin should have required property 'url'`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: {
      url: ''
    }
  })).rejects.toEqual(new Error(`data.origin should have required property 'mongodbOptions'`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: {
      url: '',
      mongodbOptions: {}
    }
  })).rejects.toEqual(new Error(`data.origin should have required property 'databases'`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: {
      url: '',
      mongodbOptions: {},
      databases: []
    }
  })).rejects.toEqual(new Error(`data should have required property 'target'`));

  await expect(libPackage({
    projectName: 'TestSuite',
    doBackup: false,
    doRestore: false,
    origin: {
      url: '',
      mongodbOptions: {},
      databases: []
    },
    target: {}
  })).rejects.toEqual(new Error(`data.target should have required property 'url'`));

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
      url: ''
    }
  })).rejects.toEqual(new Error(`data.target should have required property 'mongodbOptions'`));

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
      mongodbOptions: {}
    }
  })).rejects.toEqual(new Error(`data.target should have required property 'useOriginDatabases'`));

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
      useOriginDatabases: true
    }
  })).rejects.toEqual(new Error(`data.target should have required property 'databases'`));

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
      databases: []
    }
  })).rejects.toEqual(new Error(`data.target should have required property 'dbNameAppend'`));
});