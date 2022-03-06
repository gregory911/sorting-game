<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import './services/i18n/i18n';
  import {
    _,
    isLoading,
  } from 'svelte-i18n';
  import GarbageItem from './components/garbageItem.svelte';
  import { GarbageData} from "./data/garbageData";

  const flipDurationMs = 200;
  let garbageList = Object.values(GarbageData).map(
    (garbage) => {
      return {
        id: garbage.id,
        items: []
      };
    }
  );
  let garbageItems = Object.values(GarbageData).map((garbage) => {
    return garbage.items;
  }).flat();

  const totalGarbageQty = Object.keys(GarbageData).length,
        totalItemQty = garbageItems.length,
        itemSize = '70vw',
        itemPadding = '0.5rem',
        garbageSpacing = '2rem';
  let styles = {
    'total-item-qty': totalItemQty,
    'total-garbage-qty': totalGarbageQty,
    'item-size': `calc(${itemSize} / ${totalGarbageQty})`,
    'item-padding': itemPadding,
    'garbage-spacing': garbageSpacing,
    'item-size-padded': `calc((${itemSize} / ${totalGarbageQty}) + ${itemPadding})`,
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(';');
  console.log('TEST ITEMS', garbageList, garbageItems, );

  const handleGarbageItems = (gid, e) => {
    // console.log('HANDLING GARBAGE ITEMS', e, e.detail, e.detail.items ? 'GOT GARBAGE ITEMS' : 'NO GARBAGE ITEMS');
    const garbageIdx = garbageList.findIndex(g => g.id === gid);
    // console.log(
    //   'CHECK GARBAGE',
    //   garbageIdx,
    //   garbageList[garbageIdx],
    //   garbageList[garbageIdx].items ? 'FOUND GARBAGE ITEMS' : 'NO GARBAGE ITEMS FOUND'
    // );
    garbageList[garbageIdx].items = e.detail.items;
    garbageList = [...garbageList];
    console.log('UPDATED GARBAGE LIST', garbageList, GarbageData);
  }
  function handleItems(e) {
    // console.log('HANDLING ITEMS', e, e.detail);
    // console.log('TEST DETAIL ITEMS', e.detail.items ? 'GOT ITEMS' : 'NO ITEMS');
    garbageItems = [...e.detail.items];
    console.log('UPDATED ITEMS LIST', garbageItems, GarbageData);
  }
</script>

{#if $isLoading}
    Please wait...
{:else}
    <main style="{cssVarStyles}">
        <h1>{$_('appTitle')}</h1>
        <div class="itemContainer">
            <div
                class="itemCarousel"
                use:dndzone={{items: garbageItems, flipDurationMs, dragDisabled: garbageItems.length === 0}} on:consider={handleItems} on:finalize={handleItems}
            >
                {#if (!garbageItems.length)}
                    <div class="emptyItems">
                        <p>No more items</p>
                    </div>
                {:else}
                    {#each garbageItems as garbageItem (garbageItem.id)}
                        <GarbageItem garbageItemID={garbageItem.id}/>
                    {/each}
                {/if}
            </div>
        </div>
        <div class="garbageContainer">
            {#each garbageList as garbage (garbage.id)}
                <div
                    data-garbageID="{garbage.id}"
                    data-garbageName="{$_('garbage.' + garbage.id)}"
                    style="--garbageImageUrl: url('/images/poubelles/{garbage.id}.JPG')"
                    use:dndzone={{items: garbage.items, flipDurationMs, dragDisabled: true}}
                    on:consider={(e) => handleGarbageItems(garbage.id, e)}
                    on:finalize={(e) => handleGarbageItems(garbage.id, e)}
                >
                    {#each garbage.items as garbageItem (garbageItem.id)}
                        <GarbageItem garbageItemID={garbageItem.id}/>
                    {/each}
                </div>
            {/each}
        </div>
    </main>
{/if}

<style>
    main {
        text-align: center;
        padding: 1em;
        /*max-width: 240px; // NOTE: Not sure if we should keep this */
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
    .itemContainer {
        width: var(--item-size-padded);
        height: var(--item-size-padded);
        text-align: center;
        overflow: hidden;
        margin: 0 auto;
    }

    .itemCarousel {
        width: calc(var(--item-size-padded) * var(--total-item-qty));
        height: var(--item-size-padded);
        padding-left: calc(var(--item-padding) / 2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
    }
    .itemCarousel .emptyItems {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: var(--item-size);
        height: var(--item-size);
    }
    .garbageContainer {
        display: flex;
        flex-direction: row;
        width: calc((var(--item-size-padded) + var(--garbage-spacing)) * var(--total-garbage-qty));
        height: var(--item-size-padded);
        justify-content: space-between;
        margin: 0 auto;
        overflow: hidden;
        margin-top: 2rem;
    }
    .garbageContainer > div:before,
    .garbageContainer > div:after {
        --garbageContainerPadding: 1rem;
        --garbagePaddingHorizontal: calc(var(--garbageContainerPadding) * 2);
        --garbageBoxSize: calc(var(--item-size-padded) - var(--garbagePaddingHorizontal));
        content: "";
        padding: var(--garbageContainerPadding);
        width: var(--garbageBoxSize);
        height: var(--garbageBoxSize);
        display: flex;
        justify-content: center;
        align-items: end;
    }
    .garbageContainer > div:before {
        background-image: var(--garbageImageUrl);
        background-origin: content-box;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
    }
    .garbageContainer > div:after {
        content: attr(data-garbageName);
        background: var(--dark-bg);
        position: absolute;
        bottom: 0;
        height: auto;
        border-radius: var(--label-radius);
    }
    .garbageContainer > div {
        color: white;
        width: var(--item-size-padded);
        height: var(--item-size-padded);
        display: block;
        position: relative;
        border-radius: 1rem;
        border: 1px solid var(--dark-bg);
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
