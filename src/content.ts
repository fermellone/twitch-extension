console.log('Content script loaded');

let isUsersChannel = false;

chrome.storage.local.get(['channelName'], (result) => {
	console.log('asd', result.channelName);

	isUsersChannel = window.location.href.includes(result.channelName);
});

const interval = setInterval(() => {
	if (!isUsersChannel) {
		return;
	}

	console.log('isUsersChannel', isUsersChannel);
}, 1000);

window.onbeforeunload = () => {
	console.log('cleaning interval');
	clearInterval(interval);
};
