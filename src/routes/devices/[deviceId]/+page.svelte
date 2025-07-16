<script>
	import { page } from '$app/stores';
	import DeviceForm from '$lib/components/DeviceForm.svelte';

	$: id = $page.params.deviceId;
</script>

<DeviceForm {id} />
