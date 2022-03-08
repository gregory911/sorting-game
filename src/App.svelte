<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import Fa from 'svelte-fa'
  import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
  import * as animateScroll from "svelte-scrollto";
  import './services/i18n/i18n';
  import {
    _,
    isLoading,
  } from 'svelte-i18n';
  import GarbageItem from './components/garbageItem.svelte';
  import { GarbageData} from "./data/garbageData";

  const flipDurationMs = 200;
  let garbageList, garbageItems;
  const initData = () => {
    console.log("INIT DATA");
    garbageList = Object.values(GarbageData).map(
      (garbage) => {
        return {
          id: garbage.id,
          active: false,
          items: []
        };
      }
    );
    garbageItems = Object.values(GarbageData).map((garbage) => {
      return garbage.items;
    }).flat();
  };

  initData();

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
  console.log('TEST ITEMS', garbageList, garbageItems);

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
  const handleItems = (e) => {
    // console.log('HANDLING ITEMS', e, e.detail);
    // console.log('TEST DETAIL ITEMS', e.detail.items ? 'GOT ITEMS' : 'NO ITEMS');
    garbageItems = [...e.detail.items];
    console.log('UPDATED ITEMS LIST', garbageItems, GarbageData);
  }
  const expandGarbage = (garbageID: string) => {
    const garbageIndex = garbageList.findIndex((garbage) => garbage.id === garbageID);
    garbageList[garbageIndex].active = !garbageList[garbageIndex].active;
    console.log("Extending garbage content", garbageID, garbageList);
    if (garbageList[garbageIndex].active) {
      animateScroll.scrollTo({element: `#col-${garbageID}`});
    } else {
      animateScroll.scrollTo({element: '#app-title'});
    }
  }

</script>

{#if $isLoading}
    Please wait...
{:else}
    <main style="{cssVarStyles}">
        <h1 id="app-title">{$_('appTitle')}</h1>
        <button on:click={initData}>{$_('actions.reset')}</button>
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
                <div id="col-{garbage.id}" class="col" class:active={garbage.active}>
                    <button type="button" disabled={garbage.items.length === 0} on:click={() => expandGarbage(garbage.id)} class:active={garbage.active}>
                        <span>{$_('actions.show_results')}</span>
                        <Fa icon={faUserCheck} size="2x"/>
                    </button>
                    <div
                        data-garbageID="{garbage.id}"
                        data-garbageName="{$_('garbage.' + garbage.id)}"
                        class="garbage"
                        style="--garbageImageUrl: url('/images/poubelles/{garbage.id}.JPG')"
                        use:dndzone={{items: garbage.items, flipDurationMs, dragDisabled: true}}
                        on:consider={(e) => handleGarbageItems(garbage.id, e)}
                        on:finalize={(e) => handleGarbageItems(garbage.id, e)}
                    >
                        {#each garbage.items as garbageItem (garbageItem.id)}
                            <GarbageItem garbageItemID={garbageItem.id}/>
                        {/each}
                    </div>
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
        justify-content: space-between;
        margin: 0 auto;
        margin-top: 2rem;
    }
    .garbageContainer .col {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        align-items: center;
        height: auto;
        max-height: calc(var(--item-size-padded) + 4rem);
        transition: max-height 0.5s cubic-bezier(0, 1, 0, 1);
    }
    .garbageContainer .col.active {
        max-height: 10000px;
        transition: max-height 1s ease-in-out;
    }
    .garbageContainer .col > button {
        background-color: var(--validation-green);
        color: white;
        border: none;
        cursor: pointer;
        width: auto;
        box-shadow: 0 0 3px #333333;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
    }
    .garbageContainer .col > button:active,
    .garbageContainer .col > button.active {
        box-shadow: 0 0 3px var(--validation-green), var(--button-selected-shadow);
    }
    .garbageContainer .col > button:disabled {
        opacity: 60%;
        cursor: not-allowed;
    }
    .garbageContainer .col > button span {
        margin-right: 0.75rem;
    }
    .garbageContainer .garbage {
        color: white;
        width: var(--item-size-padded);
        height: auto;
        display: block;
        position: relative;
    }
    .garbageContainer .garbage:before,
    .garbageContainer .garbage:after {
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
    .garbageContainer .garbage:before {
        background-image: var(--garbageImageUrl);
        background-origin: content-box;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        padding: calc(var(--garbageContainerPadding) - 1px);
        border-radius: var(--pseudo-element-radius);
        border: 1px solid var(--dark-bg);
    }
    .garbageContainer .garbage:after {
        content: attr(data-garbageName);
        background: var(--dark-bg);
        position: absolute;
        top: calc(var(--item-size-padded) - 3.2rem);
        height: auto;
        border-radius: var(--label-radius);
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
