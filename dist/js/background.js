/******/ (() => { // webpackBootstrap
/*!*********************************!*\
  !*** ./assets/js/background.js ***!
  \*********************************/
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// when the extension is first installed, set default values
var color = '#3aa757'; // eslint-disable-next-line

chrome.runtime.onInstalled.addListener(function () {
  // eslint-disable-next-line
  chrome.storage.sync.set({
    color: color
  });
  console.log('Default background color set to %cgreen', "color: ".concat(color));
}); // eslint-disable-next-line

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var _i = 0, _Object$entries = Object.entries(changes); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        _Object$entries$_i$ = _Object$entries$_i[1],
        oldValue = _Object$entries$_i$.oldValue,
        newValue = _Object$entries$_i$.newValue;

    console.log("Storage key \"".concat(key, "\" in namespace \"").concat(namespace, "\" changed."), "Old value was \"".concat(oldValue, "\", new value is \"").concat(newValue, "\"."));
  }
}); // eslint-disable-next-line
/******/ })()
;