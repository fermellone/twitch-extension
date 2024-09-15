<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { Separator } from '$lib/components/ui/separator';

	import UserSettings from '$lib/components/UserSettings.svelte';
	import Plugins from '$lib/components/Plugins.svelte';

	const activeTab = 'plugins';
</script>

<Tabs.Root value={activeTab}>
	<div class="flex items-center px-4 py-2">
		<h1 class="text-xl font-bold">Twitch Plugins</h1>
		<Tabs.List class="ml-auto">
			<Tabs.Trigger value="plugins" class="text-zinc-600 dark:text-zinc-200">Plugins</Tabs.Trigger>
			<Tabs.Trigger value="settings" class="text-zinc-600 dark:text-zinc-200">Settings</Tabs.Trigger
			>
		</Tabs.List>
	</div>
	<Separator class="mb-6 mt-2" />
	<Tabs.Content value="plugins" class="m-0">
		<Plugins />
	</Tabs.Content>
	<Tabs.Content value="settings" class="m-0">
		<UserSettings />
	</Tabs.Content>
</Tabs.Root>
