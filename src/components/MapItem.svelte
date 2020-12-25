<script lang="ts">
import type { TRegion } from '../types';
import { DataType } from '../types';

export let dataType: DataType = undefined;
export let multiplier = 1;
export let item: TRegion = undefined;
export let loading = false;
export let active = false;
</script>

<div
  class="flex flex-col justify-around p-2 text-gray-100"
  class:bg-blue-500={item}
  class:loading
  class:active={!loading && active && item}
  class:clickable={!loading && !active && item}
  on:click
>
  {#if item}
    <div>{item.code}</div>

    {#if dataType === DataType.Cost}
      <div>{item.cost * multiplier}</div>
    {:else}
      <div>{item.resistance}</div>
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
  @apply cursor-pointer bg-green-500;
}
</style>
