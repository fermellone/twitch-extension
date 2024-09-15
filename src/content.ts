import type { Plugin } from '$lib/types';
import { getFromStorage } from '$lib/utils';

console.info('Content script loaded');

let isUsersChannel = false;
let messagesLength = 0;

const readMessage = async (message: string, maxDuration: number) => {
	const synth = window.speechSynthesis;

	const voices = synth.getVoices();

	let filteredVoices = voices.filter((v) => v.lang.includes('es-PY'));

	filteredVoices = filteredVoices.length
		? filteredVoices
		: voices.filter((v) => v.lang.includes('es'));

	const utterThis = new SpeechSynthesisUtterance(message);
	utterThis.voice = filteredVoices[0];

	synth.speak(utterThis);

	let second = 0;

	await new Promise((resolve) => {
		const interval = setInterval(() => {
			second++;

			if (second >= maxDuration) {
				synth.cancel();
				clearInterval(interval);
				resolve(null);
			}
		}, 1000);
	});
};

chrome.storage.local.get(['userSettings'], (result) => {
	const userSettings = result.userSettings;

	if (!userSettings) {
		return;
	}

	isUsersChannel = window.location.href.includes(userSettings.channelName);
});

let processTimeout: NodeJS.Timeout;

const asyncInterval = async (callback: () => Promise<void>, ms: number) => {
	await callback();
	processTimeout = setTimeout(() => asyncInterval(callback, ms), ms);
};

const processChat = async () => {
	if (
		!isUsersChannel ||
		!document.querySelector('div[data-test-selector=channel_panels_toggle_selector]')
	) {
		return;
	}

	const synth = window.speechSynthesis;
	if (synth.getVoices().length === 0) {
		return;
	}

	const chatElement = document.querySelector<HTMLElement>(
		'div[data-test-selector=chat-scrollable-area__message-container]'
	);

	if (!chatElement?.children.length) {
		return;
	}

	const chatMessages = Array.from(chatElement.children);
	if (chatMessages.length <= messagesLength) {
		return;
	}

	const lastMessage = chatMessages[chatMessages.length - 1] as HTMLElement;
	if (
		lastMessage.textContent?.includes('AutoMod') ||
		lastMessage.getAttribute('data-a-target') === 'chat-welcome-message'
	) {
		return;
	}

	const lastMessageWriter = lastMessage.querySelector('.chat-line__username')?.textContent;
	const lastMessageText = lastMessage.querySelector(
		'span[data-a-target=chat-message-text]'
	)?.textContent;
	const isARedeemMessage = lastMessage.getAttribute('data-test-selector') === 'user-notice-line';

	const messageToRead = isARedeemMessage
		? lastMessage.textContent || ''
		: `${lastMessageWriter} dice: ${lastMessageText}`;

	const plugins = await getFromStorage<Plugin[]>('plugins');

	const ttsPlugin = plugins.find((plugin) => plugin.name === 'TTS');

	if (ttsPlugin && ttsPlugin.enabled) {
		await readMessage(messageToRead, 15);
	}

	messagesLength = chatMessages.length;
};

asyncInterval(processChat, 1000);

window.addEventListener('beforeunload', () => {
	clearTimeout(processTimeout);
});
