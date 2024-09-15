<script>
	import { onMount } from 'svelte';

	let channelName = '';

	const saveChannelName = () => {
		chrome.storage.local.set({ channelName });
	};

	onMount(() => {
		chrome.storage.local.get(['channelName'], (result) => {
			channelName = result.channelName;
		});
	});
</script>

<input type="text" bind:value={channelName} />

<button on:click={saveChannelName}>Save</button>
