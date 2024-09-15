<script lang="ts">
	import { onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { PLUGINS } from '$lib/constants';
	import type { Plugin } from '$lib/types';

	let plugins: Plugin[] = [];

	const togglePlugin = (pluginName: string) => {
		const plugin = plugins.find((plugin) => plugin.name === pluginName);
		if (plugin) {
			plugin.enabled = !plugin.enabled;
			chrome.storage.local.set({ plugins });
		}
	};

	let x = 0;

	onMount(() => {
		chrome.storage.local.get(['plugins'], (result) => {
			const pluginsRaw = result.plugins;
			if (pluginsRaw) {
				plugins = pluginsRaw;
			} else {
				plugins = PLUGINS;
				chrome.storage.local.set({ plugins });
			}
		});
	});
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Plugins</Card.Title>
		<Card.Description>Manage your plugins here.</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-6">
		{#each plugins as plugin}
			<div class="flex items-center justify-between space-x-4">
				<Label for="necessary" class="flex flex-col space-y-1">
					<span>{plugin.name}</span>
					<span class="text-xs font-normal leading-snug text-muted-foreground">
						{plugin.description}
					</span>
				</Label>
				<Switch
					id={plugin.name}
					checked={plugin.enabled}
					aria-label={plugin.name}
					onCheckedChange={() => togglePlugin(plugin.name)}
				/>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
