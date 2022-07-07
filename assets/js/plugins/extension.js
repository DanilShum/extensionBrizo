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

  get tabs() {
    return this.extension.tabs;
  }

  storageSyncSet(params) {
    this.storage.sync.set(params);
  }

  storageSyncGet(keys, callback) {
    this.storage.sync.get(keys, callback);
  }

  storageSyncOnChanged(callback) {
    this.storage.onChanged.addListener(callback);
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

  tabQuery(params, callback) {
    this.tabs.query(params, callback);
  }

  tabSendMessage({ id, payload, callback }) {
    this.tabs.sendMessage(id, payload, callback);
  }

  tabCreate(params) {
    this.tabs.create(params);
  }
}

export const prototypeExtension = new Extension();
