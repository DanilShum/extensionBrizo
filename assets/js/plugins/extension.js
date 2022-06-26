export default class Extension {
  constructor() {
    this.extension = window.chrome;
    this.test = '';
  }
  get runtime() {
    return this.extension.runtime;
  }
  get storage() {
    return this.extension.storage;
  }

  storageSyncSet(params) {
    this.storage.sync.set(params);
  }

  storageSyncGet(keys, callback) {
    this.storage.sync.get(keys, callback);
  }

  storageSyncClear() {
    this.storage.sync.clear();
  }

  runtimeSendMessage(payload) {
    this.runtime.sendMessage(payload, function (ret) {
      return console.log('runtimeSendMessage');
    });
  }

  runtimeOnMessage(callback) {
    this.runtime.onMessage.addListener(callback);
  }
}

export const prototypeExtension = new Extension();
