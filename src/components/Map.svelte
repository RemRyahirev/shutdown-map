<script lang="ts">
import type { TRegion } from '../types';
import { DataType } from '../types';

import { data } from '../stores/data';

import MapItem from './MapItem.svelte';

export let dataType: DataType;
export let multiplier = 1;
let selected: string | null = null;

function handleClick(key: string | null) {
  return () => {
    selected = key === selected ? null : key;
  };
}

const size = 64;

let entries: Array<[string, TRegion]>;
$: entries = $data.isLoaded && Object.entries($data.regions);
$: cols = $data.cols;
$: rows = $data.rows;
$: coordsMap = entries && entries.reduce((map, [key, item]) => {
  map[item.map.join(' ')] = key;
  return map;
}, {});
$: activeRegion = selected && $data?.regions?.[selected];
</script>

<div class="relative">
  <div
    class="grid justify-center gap-1"
    style={`grid-template-columns: repeat(${cols}, ${size}px); grid-auto-rows: ${size}px;`}
  >
    {#each new Array(rows).fill('') as _, row}
      {#each new Array(cols).fill('') as _, col}
        {#if !$data.isLoaded}
          <MapItem loading={$data.regionCoords.includes(`${col} ${row}`)} />
        {:else if coordsMap[`${col} ${row}`]}
          <MapItem
            item={$data.regions[coordsMap[`${col} ${row}`]]}
            dataType={dataType}
            multiplier={multiplier}
            active={$data.regions[coordsMap[`${col} ${row}`]].key === selected}
            on:click={handleClick($data.regions[coordsMap[`${col} ${row}`]].key)}
          />
        {:else}
          <MapItem />
        {/if}
      {/each}
    {/each}
  </div>

  <div
    class="absolute right-0 bottom-0"
  >
    <div class="flex items-center justify-between text-xl">
      {#if dataType === DataType.Cost && !activeRegion}
        <div>
          Стоимость для всей России
        </div>

        <div class="ml-8 font-bold">
          {$data.totalCost} млрд. руб.
        </div>
      {:else if activeRegion}
        <div>
          {activeRegion.name}
        </div>

        <div class="ml-8 font-bold">
          {#if dataType === DataType.Cost}
            {activeRegion.cost} млн. руб.
          {:else}
            {activeRegion.resistance}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
</style>
