const isSourcePage = url => {
  if (url.includes('github.com')) {
    return url.includes('/blob/') || url.includes('/commit/')
  }

  if (url.includes('bitbucket.org')) {
    return (url.includes('/commits/') && !url.includes('/commits/all')) ||
            url.includes('fileviewer=file-view-default')
  }

  return false
}

chrome.tabs.onUpdated.addListener((id, details, tab) => {
  const url = tab.url

  chrome.storage.sync.get('tabSize', function(items) {
    if (!isSourcePage(url)) {
      return
    }

    const queryParam = `ts=${items.tabSize}`
    if (url.includes(queryParam)) {
      return
    }

    const hashStart = url.includes('#') ? url.indexOf('#') : url.length
    const querySymbol = url.includes('?') ? '&' : '?'
    const oldURL = encodeURIComponent(url.substring(0, hashStart))
    const newURL = oldURL + querySymbol + queryParam + url.substring(hashStart)

    chrome.tabs.update(id, {
      url: `javascript:location.replace('${newURL}')`
    })
  })
})
