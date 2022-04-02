// when the extension is first installed, set default values

// eslint-disable-next-line
chrome.runtime.onInstalled.addListener(function () {
  // eslint-disable-next-line
  // chrome.storage.sync.set(
  //   {
  //     toggleSitesActive: false,
  //     toggleSitesList: 'example.com',
  //   },
  //   function () {}
  // );
});
