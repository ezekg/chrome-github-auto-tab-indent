function saveOptions() {
  var ts = document.getElementById("tab-size").value;

  chrome.storage.sync.set({
    tabSize: ts
  }, function() {
    var status = document.getElementById("status");

    status.textContent = "Options saved.";
    setTimeout(function() {
      status.textContent = "";
    }, 2000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    tabSize: 2
  }, function(items) {
    document.getElementById("tab-size").value = items.tabSize;
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
