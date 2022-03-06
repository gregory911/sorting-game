<script lang="ts">
  import '../services/i18n/i18n';
  import { _ } from 'svelte-i18n';

  export let garbageItemID: string;
  console.log("Test Garbage Item ID", garbageItemID);
  let isPlaceholder = garbageItemID.indexOf('dnd-shadow-placeholder') >= 0;
</script>
<div>
    {#if (!isPlaceholder)}
        <img src="images/dechets/{garbageItemID}.JPG" alt="{$_('garbageItem.' + garbageItemID)}"/>
        <p>{$_('garbageItem.' + garbageItemID)}</p>
    {/if}
</div>

<style>
    div {
        align-items: center;
        background-color: var(--color-bg);
        color: var(--color-on-bg);
        border-radius: 10px;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        width: var(--item-size);
        height: var(--item-size);
        justify-content: center;
        position: relative;
        scroll-snap-align: start;
        transform: scale(1);
        transform-origin: center center;
        transition: transform 0.5s;
    }
    div img {
        width: 30%;
    }
</style>
