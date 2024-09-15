<script lang="ts">
	import type { UserSettings } from '$lib/types';
	import { onMount } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	let userSettings: UserSettings = {
		channelName: ''
	};

	const saveSettings = () => {
		chrome.storage.local.set({ userSettings });
	};

	onMount(() => {
		chrome.storage.local.get(['userSettings'], (result) => {
			const userSettingsRaw = result.userSettings;
			if (userSettingsRaw) {
				userSettings = userSettingsRaw;
			}
		});
	});
</script>

<form class="flex flex-col gap-2" on:submit|preventDefault={saveSettings}>
	<Label>Channel Name</Label>
	<Input type="text" bind:value={userSettings.channelName} />

	<Button type="submit">Save</Button>
</form>
