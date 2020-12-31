<script lang="ts">
import type { TRegion } from '../types';
import { DataType, DataGroup } from '../types';

import { format } from '../utils';

export let dataType: DataType = undefined;
export let multiplier = 1;
export let item: TRegion = undefined;
export let loading = false;
export let active = false;

$: isActive = !loading && active && item;
$: clickable = !loading && !active && item;
$: group = dataType === DataType.Cost ? item?.costGroup : item?.resistanceGroup;
</script>

<div
  class="flex flex-col h-full justify-around p-2 text-gray-100"
  class:loading
  class:clickable
  class:active={isActive}
  class:bg-yellow-500={item && group === DataGroup.Medium}
  class:bg-green-500={group === DataGroup.High}
  class:bg-red-500={group === DataGroup.Low}
  on:click
>
  {#if item}
    <div>{item.code}</div>

    {#if dataType === DataType.Cost}
      <div>{format(item.cost * multiplier, false)}</div>
    {:else}
      <div>{format(item.resistance, false)}</div>
    {/if}
  {/if}
</div>

<style lang="postcss">
.loading {
  @apply animate-pulse bg-gray-400;
}
.clickable {
  @apply cursor-pointer hover:bg-blue-400;
}
.active {
  @apply cursor-pointer bg-blue-500;
}
</style>
