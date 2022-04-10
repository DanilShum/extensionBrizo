// when the extension is first installed, set default values

let color = '#3aa757';
// eslint-disable-next-line
chrome.runtime.onInstalled.addListener(() => {
  // eslint-disable-next-line
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

// eslint-disable-next-line
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
// eslint-disable-next-line

