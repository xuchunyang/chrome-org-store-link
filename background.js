chrome.browserAction.onClicked.addListener(function(tab) {
  let url = "http://localhost:4444/?url=" + encodeURIComponent(tab.url)
      + "&title=" + encodeURIComponent(tab.title);
  fetch(url).then(r => r.text()).then(result => {
    console.log(result);
    alert(result);
  });
});
