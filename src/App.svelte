<script lang="ts">
import { fly } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

import { CostType, DataType, MapView } from './types';
import { data } from './stores/data';

import Map from './components/Map.svelte';
import Switch from './components/Switch.svelte';
import InputNumber from './components/InputNumber.svelte';

let days = 1;
let hours = 0;

let type: DataType = DataType.Cost;
let typesActive = false;
function toggleTypesActive() {
  typesActive = !typesActive;
}
function setType(newType: DataType) {
  return () => {
    type = newType;
    typesActive = false;
  };
}

let typeSelector: HTMLDivElement;
function handleBodyClick(e: any) {
  if (!typesActive || !typeSelector) {
    return;
  }

  if (!typeSelector.contains(e.target)) {
    typesActive = false;
  }
}

let isMobileType = false;

let mapView: MapView = MapView.Map;
function setView(newView: MapView) {
  return () => {
    mapView = newView;
  };
}

$: types = $data?.costTypes ?? [];
$: costType = isMobileType ? CostType.Mobile : CostType.Full;
$: multiplier = (hours / 24 + days) * (isMobileType ? 0.5 : 1);
</script>

<svelte:body on:click={handleBodyClick} />

<main class="p-4 flex flex-col">
  <h2 class="text-4xl text-center mb-8">
    Карта
    <span
      class="relative"
      bind:this={typeSelector}
    >
      <button
        class="border-dashed border-current border-b-2 border-opacity-50 hover:border-transparent focus:outline-none cursor-pointer"
        on:click={toggleTypesActive}
      >
        {#if type === DataType.Cost}
          стоимости
        {:else}
          устойчивости
        {/if}
      </button>

      {#if typesActive}
        <div
          class="type-selector"
          transition:fly={{ easing: quintOut, y: -50 }}
        >
          <button
            class="block w-full text-left px-4 py-2 pb-4 focus:outline-none cursor-pointer"
            class:hover:bg-gray-400={type !== DataType.Cost}
            class:bg-gray-500={type === DataType.Cost}
            class:text-gray-100={type === DataType.Cost}
            on:click={setType(DataType.Cost)}
          >
            стоимости
          </button>

          <button
            class="block w-full text-left px-4 py-2 pb-4 focus:outline-none cursor-pointer"
            class:hover:bg-gray-400={type !== DataType.Resistance}
            class:bg-gray-500={type === DataType.Resistance}
            class:text-gray-100={type === DataType.Resistance}
            on:click={setType(DataType.Resistance)}
          >
            устойчивости
          </button>
        </div>
      {/if}
    </span>

    {#if type === DataType.Cost}
      интернет-шатдауна
    {:else}
      к интернет-шатдауну
    {/if}
  </h2>

  <div class="flex mb-8 items-center">
    <div class="flex flex-row items-center mr-16">
      <button
        class="flex justify-center items-center px-4 py-2 border border-gray-400 rounded-l cursor-pointer focus:outline-none"
        class:hover:bg-gray-300={mapView !== MapView.Map}
        class:bg-gray-400={mapView === MapView.Map}
        disabled={mapView === MapView.Map}
        on:click={setView(MapView.Map)}
      >
        Map
      </button>

      <button
        class="flex justify-center items-center px-4 py-2 border border-l-0 border-r-0 border-gray-400 cursor-pointer focus:outline-none"
        class:hover:bg-gray-300={mapView !== MapView.Asc}
        class:bg-gray-400={mapView === MapView.Asc}
        disabled={mapView === MapView.Asc}
        on:click={setView(MapView.Asc)}
      >
        Asc
      </button>

      <button
        class="flex justify-center items-center px-4 py-2 border border-gray-400 rounded-r cursor-pointer focus:outline-none"
        class:hover:bg-gray-300={mapView !== MapView.Desc}
        class:bg-gray-400={mapView === MapView.Desc}
        disabled={mapView === MapView.Desc}
        on:click={setView(MapView.Desc)}
      >
        Desc
      </button>
    </div>

    <div
      class="flex flex-row items-center mr-16"
      class:invisible={type === DataType.Resistance}
    >
      <Switch
        offText="Полный"
        onText="Мобильный"
        bind:checked={isMobileType}
      />
    </div>

    <div
      class="flex flex-row items-center mr-8"
      class:invisible={type === DataType.Resistance}
    >
      <span class="pr-4">Дни</span>
      <InputNumber bind:value={days} />
    </div>

    <div
      class="flex flex-row items-center"
      class:invisible={type === DataType.Resistance}
    >
      <span class="pr-4">Часы</span>
      <InputNumber bind:value={hours} />
    </div>
  </div>

  <Map dataType={type} mapView={mapView} multiplier={multiplier} />
</main>

<style global lang="postcss">
@tailwind base;
@tailwind components;

@tailwind utilities;

.type-selector {
  @apply block top-full left-0 z-10 py-2 origin-top absolute mt-2 rounded-md shadow-lg bg-gray-300 ring-1 ring-black ring-opacity-5;
}
</style>
