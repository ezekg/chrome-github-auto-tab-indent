chrome.tabs.onUpdated.addListener(function(id, details, tab) {
  var url = tab.url;

  /**
   * Check if an array or string contains string
   *
   * @param  {Str|Arr} haystack
   * @param  {Str}     needle
   *
   * @return {Bool}
   */
  var contains = function(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
  };

  /**
   * Check if current page contains source code
   *
   * @param  {Str} url
   *
   * @return {Bool}
   */
  var isSourcePage = function(url) {

    if (contains(url, "github.com")) {
      return contains(url, "/blob/") || contains(url, "/commit/");
    }

    if (contains(url, "bitbucket.org")) {
      return contains(url, "fileviewer=file-view-default") || (contains(url, "/commits/") && !contains(url, "/commits/all"));
    }

    return false;
  };

  chrome.storage.sync.get("tabSize", function(items) {
    var tabSpacing = encodeURI("ts=" + items.tabSize);

    if (contains(url, tabSpacing) || !isSourcePage(url)) {
      return;
    }

    var hashStart   = contains(url, "#") ? url.indexOf("#") : url.length;
    var querySymbol = contains(url, "?") ? "&" : "?";
    var newURL      = url.substring(0, hashStart) + querySymbol + tabSpacing + url.substring(hashStart);

    chrome.tabs.update(id, {
      url: "javascript:location.replace('" + newURL + "')"
    });
  });
});
