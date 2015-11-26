chrome.tabs.onUpdated.addListener(function(id, details, tab) {
  chrome.storage.sync.get("tabSize", function(items) {
    var tabSpacing = encodeURI("ts=" + items.tabSize);
    var url        = tab.url;

    if (url.indexOf(tabSpacing) > 0 || (url.indexOf("/blob/") === -1 && url.indexOf("/commit/") === -1)) {
      return;
    }

    var hashStart   = url.indexOf("#") === -1 ? url.length : url.indexOf("#");
    var querySymbol = url.indexOf("?") === -1 ? "?" : "&";
    var newURL      = url.substring(0, hashStart) + querySymbol + tabSpacing + url.substring(hashStart);

    chrome.tabs.update(id, {
      url: newURL
    });
  });
});
