chrome.tabs.onUpdated.addListener(function(id, details, tab) {

  /**
   * Check if current page contains source code
   *
   * @return {Bool}
   */
  var isSourcePage = function(url) {

    /**
     * Check if current url contains string
     *
     * @return {Bool}
     */
    var urlContains = function(str) {
      return Boolean(~url.indexOf(str));
    };

    if (urlContains("github.com")) {
      return urlContains("/blob/") || urlContains("/commit/");
    }

    if (urlContains("bitbucket.org")) {
      return urlContains("fileviewer=file-view-default") || (urlContains("/commits/") && urlContains("at=master"));
    }

    return false;
  };

  chrome.storage.sync.get("tabSize", function(items) {
    var tabSpacing = encodeURI("ts=" + items.tabSize);
    var url        = tab.url;

    if (url.indexOf(tabSpacing) > 0 || !isSourcePage(url)) {
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
