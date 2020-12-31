<script lang="ts">
import { flip } from 'svelte/animate';
import { fade } from 'svelte/transition';
import { quintOut, linear, cubicInOut, expoInOut, quintInOut } from 'svelte/easing';

import type { TRegion } from '../types';
import { DataType, MapView } from '../types';

import { format } from '../utils';
import { data } from '../stores/data';

import MapItem from './MapItem.svelte';

export let dataType: DataType;
export let mapView: MapView;
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
$: arr = new Array(rows * cols).fill('');
$: regionsLen = $data.regions ? Object.keys($data.regions).length : $data.regionCoords?.length;
$: regionsPosition = !$data.isLoaded && $data.regionCoords.map(str => {
  const [col, row] = str.split(' ');
  return row * cols + col;
});
$: positionMap = entries && entries.reduce((map, [key, item]) => {
  let pos = dataType === DataType.Cost ? item.costPosition : item.resistancePosition;

  switch (mapView) {
    case MapView.Map:
      pos = item.map[1] * cols + item.map[0];
      break;

    case MapView.Asc:
      pos = regionsLen - pos - 1;
      break;

    case MapView.Desc:
      break;

    default:
      return map;
  }

  map[pos] = key;
  return map;
}, {});
$: activeRegion = selected && $data?.regions?.[selected];
</script>

<div class="relative">
  <div
    class="grid justify-center gap-1"
    style={`grid-template-columns: repeat(${cols}, ${size}px); grid-auto-rows: ${size}px;`}
  >
    {#each arr as _, position (positionMap[position] ?? position)}
      <div
        class="flex flex-col"
      >
        {#if !$data.isLoaded}
          <MapItem
            loading={regionsPosition.includes(position)}
          />
        {:else if positionMap[position]}
          <MapItem
            item={$data.regions[positionMap[position]]}
            dataType={dataType}
            multiplier={multiplier}
            active={$data.regions[positionMap[position]].key === selected}
            on:click={handleClick($data.regions[positionMap[position]].key)}
          />
        {:else}
          <MapItem />
        {/if}
      </div>
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
          {format($data.totalCost * multiplier)} млрд. руб.
        </div>
      {:else if activeRegion}
        <div>
          {activeRegion.name}
        </div>

        <div class="ml-8 font-bold">
          {#if dataType === DataType.Cost}
            {format(activeRegion.cost  * multiplier)} млн. руб.
          {:else}
            {format(activeRegion.resistance)}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
</style>
