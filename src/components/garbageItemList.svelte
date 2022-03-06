<script lang="ts">
  import GarbageItem from './garbageItem.svelte';
  export let itemList: Array<any>;
</script>

{#each itemList as item (item.id)}
    <GarbageItem garbageItemID={item.id}/>
{/each}
