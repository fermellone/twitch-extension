console.log('Content script loaded');

let isUsersChannel = false;
let messagesLength = 0;

const readMessage = async (message: string) => {
	const synth = window.speechSynthesis;

	const voices = await synth.getVoices();

	console.log('voices', voices);

	let filteredVoices = voices.filter((v) => v.lang.includes('es-PY'));

	filteredVoices = filteredVoices.length
		? filteredVoices
		: voices.filter((v) => v.lang.includes('es'));

	const utterThis = new SpeechSynthesisUtterance(message);
	console.log('filtered voices', filteredVoices);
	utterThis.voice = filteredVoices[0];
	synth.speak(utterThis);
};

chrome.storage.local.get(['userSettings'], (result) => {
	console.log('userSettings', result);
	const userSettings = result.userSettings;

	if (!userSettings) {
		return;
	}

	isUsersChannel = window.location.href.includes(userSettings.channelName);
});

const interval = setInterval(async () => {
	const domIsReady = document.querySelector(
		'div[data-test-selector=channel_panels_toggle_selector]'
	);

	if (!isUsersChannel || !domIsReady) {
		return;
	}

	const chatMessageElements = document.querySelectorAll('.chat-line__message');

	if (!chatMessageElements.length) {
		return;
	}

	const chatMessages = Array.from(chatMessageElements);

	if (chatMessages.length === messagesLength) {
		return;
	}

	const lastMessage = chatMessages[chatMessages.length - 1];

	if (!lastMessage) {
		return;
	}

	const lastMessageWriter = lastMessage.querySelector('.chat-line__username')?.textContent;

	const lastMessageText = lastMessage.querySelector(
		'span[data-a-target=chat-message-text]'
	)?.textContent;

	await readMessage(`${lastMessageWriter} dice: ${lastMessageText}`);

	messagesLength = chatMessages.length;
}, 1000);

window.onbeforeunload = () => {
	clearInterval(interval);
};
