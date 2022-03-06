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
        --itemBoxPadding: 1rem;
        --itemBoxPaddingHorizontal: calc(var(--itemBoxPadding) * 2);
        --itemBoxSize: calc(var(--item-size) - var(--itemBoxPaddingHorizontal));
        align-items: center;
        /*background-color: var(--color-bg);*/
        color: var(--color-on-bg);
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        width: var(--itemBoxSize);
        height: var(--itemBoxSize);
        padding: var(--itemBoxPadding);
        justify-content: center;
        scroll-snap-align: start;
        transform: scale(1);
        transform-origin: center center;
        transition: transform 0.5s;
        position: relative;
        border-radius: 1rem;
        border: 1px solid var(--dark-bg);
    }
    div img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    div p {
        position: absolute;
        bottom: 0;
        width: var(--itemBoxSize);
        background: var(--dark-bg);
        padding: 1rem;
        margin: 0;
        border-radius: var(--label-radius);
    }
</style>
