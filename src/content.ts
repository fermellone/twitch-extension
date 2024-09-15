console.log('Content script loaded');

chrome.storage.local.get(['channelName'], (result) => {
	console.log('asd', result);
});
