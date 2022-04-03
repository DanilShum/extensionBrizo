// when the extension is first installed, set default values

let color = '#3aa757';
// eslint-disable-next-line
chrome.runtime.onInstalled.addListener(() => {
  // eslint-disable-next-line
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});
