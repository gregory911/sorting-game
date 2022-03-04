<script lang="ts">
    import { dndzone } from 'svelte-dnd-action';
    import './services/i18n/i18n';
    import {
        _,
        isLoading,
    } from 'svelte-i18n';
    import Section from './components/landing/section.svelte';

    let idx = 0;
    const flipDurationMs = 200;
    let garbages = {
        "garbage1": {
            id: "garbage1",
            items: [
                {
                    "id": "item1",
                    "name": "Item1-Garbage1",
                },
                {
                    "id": "item2",
                    "name": "Item2-Garbage1",
                },
                {
                    "id": "item3",
                    "name": "Item3-Garbage1",
                },
            ]
        },
        "garbage2": {
            id: "garbage2",
            items: [
                {
                    "id": "item4",
                    "name": "Item1-Garbage2",
                },
                {
                    "id": "item5",
                    "name": "Item2-Garbage2",
                },
                {
                    "id": "item6",
                    "name": "Item3-Garbage2",
                },
            ]
        },
        "garbage3": {
            id: "garbage3",
            items: [
                {
                    "id": "item7",
                    "name": "Item1-Garbage3",
                },
                {
                    "id": "item8",
                    "name": "Item2-Garbage3",
                },
                {
                    "id": "item9",
                    "name": "Item3-Garbage3",
                },
            ]
        }
    };
    let garbageList = Object.values(garbages).map(
        (garbage) => {
            return {
				id: garbage.id,
				items: []
			};
		}
    );
    let garbageItems = Object.values(garbages).map((garbage) => {
      return garbage.items;
    }).flat();
    console.log('TEST ITEMS', garbageList, garbageItems);

    const handleGarbageItems = (gid, e) => {
      console.log('HANDLING GARBAGE ITEMS', e, e.detail, e.detail.items ? 'GOT GARBAGE ITEMS' : 'NO GARBAGE ITEMS');
      const garbageIdx = garbageList.findIndex(g => g.id === gid);
      console.log(
        'CHECK GARBAGE',
        garbageIdx,
        garbageList[garbageIdx],
        garbageList[garbageIdx].items ? 'FOUND GARBAGE ITEMS' : 'NO GARBAGE ITEMS FOUND'
      );
      garbageList[garbageIdx].items = e.detail.items;
      garbageList = [...garbageList];
      console.log('UPDATED GARBAGE LIST', garbageList);
    }
    function handleItems(e) {
      console.log('HANDLING ITEMS', e, e.detail, e.detail.items ? 'GOT ITEMS' : 'NO ITEMS');
      garbageItems = [...e.detail.items];
      console.log('UPDATED ITEMS LIST', garbageItems);
    }
</script>

{#if $isLoading}
    Please wait...
{:else}
    <main>
        <h1>{$_('appTitle')}</h1>
        <div class="itemContainer">
            {#if (garbageItems.length === 0)}
                <p>No more items</p>
            {:else}
                <div
                    class="itemCarousel"
                    use:dndzone={{items: garbageItems, flipDurationMs}} on:consider={handleItems} on:finalize={handleItems}
                >
                {#each garbageItems as garbageItem (garbageItem.id)}
                    <Section>
                        {garbageItem.name}
                    </Section>
                {/each}
                </div>
            {/if}
        </div>
        <div class="garbageContainer">
        {#each garbageList as garbage (garbage.id)}
            <div
                data-garbageID="{garbage.id}"
                use:dndzone={{items: garbage.items, flipDurationMs, dragDisabled: true}}
                on:consider={(e) => handleGarbageItems(garbage.id, e)}
                on:finalize={(e) => handleGarbageItems(garbage.id, e)}
            >
                {#each garbage.items as garbageItem (garbageItem.id)}
                    <Section>
                        {garbageItem.name}
                    </Section>
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
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }
    .itemContainer {
        /**/
        width: 50vw;
        text-align: center;
        overflow: hidden;
        margin: 0 auto;
        /**/
    }
    .itemCarousel {
        /*display: flex;*/
        /*flex-direction: row;*/
        /*justify-content: space-between;*/
        /*overflow: scroll;*/

        /**/display: flex;
        /*overflow-x: auto;*/
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        /*// scroll-snap-points-x: repeat(300px);*/
        /*// scroll-snap-type: mandatory;*/
        /**/
    }
    .garbageContainer {
        display: flex;
        flex-direction: row;
        width: 50vw;
        justify-content: space-between;
        margin: 0 auto;
    }
    .garbageContainer > div:before {
        content: attr(data-garbageID);
        background-color: red;
        width: 100%;
        height: 2rem;
        display: block;
    }
    .garbageContainer > div {
        background-color: gray;
        color: white;
        overflow: scroll;
        height: 5rem;
        width: 100%;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
