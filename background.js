// Background script for SECAF Helper extension
chrome.action.onClicked.addListener((tab) => {
  // Only execute on SECAF pages
  if (tab.url.includes('ibge.gov.br')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['secaf_helper.js']
    });
  } else {
    chrome.tabs.create({
      url: 'error.html'
    });
  }
});
