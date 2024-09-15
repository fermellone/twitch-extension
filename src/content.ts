console.info('Content script loaded');

let isUsersChannel = false;
let messagesLength = 0;

const readMessage = (message: string, maxDuration: number) => {
	const synth = window.speechSynthesis;

	const voices = synth.getVoices();

	let filteredVoices = voices.filter((v) => v.lang.includes('es-PY'));

	filteredVoices = filteredVoices.length
		? filteredVoices
		: voices.filter((v) => v.lang.includes('es'));

	const utterThis = new SpeechSynthesisUtterance(message);
	utterThis.voice = filteredVoices[0];
	synth.speak(utterThis);

	setTimeout(() => {
		synth.cancel();
	}, maxDuration * 1000);
};

chrome.storage.local.get(['userSettings'], (result) => {
	const userSettings = result.userSettings;

	if (!userSettings) {
		return;
	}

	isUsersChannel = window.location.href.includes(userSettings.channelName);
});

const interval = setInterval(() => {
	const domIsReady = document.querySelector(
		'div[data-test-selector=channel_panels_toggle_selector]'
	);

	const synth = window.speechSynthesis;

	const voices = synth.getVoices();

	const voicesAreReady = voices.length > 0;

	if (!isUsersChannel || !domIsReady || !voicesAreReady) {
		return;
	}

	const chatElement = document.querySelector(
		'div[data-test-selector=chat-scrollable-area__message-container]'
	);

	const chatMessageElements = chatElement?.children ?? [];

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

	if (lastMessage.textContent?.includes('AutoMod')) {
		return;
	}

	const lastMessageWriter = lastMessage.querySelector('.chat-line__username')?.textContent;

	const lastMessageText = lastMessage.querySelector(
		'span[data-a-target=chat-message-text]'
	)?.textContent;

	const redeemMessage = lastMessage?.textContent ?? '';

	const messageToRead = lastMessageWriter
		? `${lastMessageWriter} dice: ${lastMessageText}`
		: redeemMessage;

	readMessage(messageToRead, 15);

	messagesLength = chatMessages.length;
}, 1000);

window.onbeforeunload = () => {
	clearInterval(interval);
};
