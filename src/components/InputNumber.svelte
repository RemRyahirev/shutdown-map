<script lang="ts">
export let min = 0;
export let max = 600;

export let value;

function inc() {
  if (value < max) {
    ++value;
  }
}
function dec() {
  if (value > min) {
    --value;
  }
}
</script>

<div class="flex flex-row border h-10 w-max-content rounded-lg border-gray-400 relative">
  <button
    class="font-semibold border-r bg-red-700 hover:bg-red-600 text-white border-gray-400 h-full w-10 flex rounded-l focus:outline-none cursor-pointer"
    on:click={dec}
  >
    <span class="m-auto pb-1">-</span>
  </button>

  <input
    class="bg-white w-24 p-2 text-base border-gray-400 focus:outline-none text-center"
    type="text"
    bind:value={value}
  >

  <button
    class="font-semibold border-l bg-blue-700 hover:bg-blue-600 text-white border-gray-400 h-full w-10 flex rounded-r focus:outline-none cursor-pointer"
    on:click={inc}
  >
    <span class="m-auto pb-1">+</span>
  </button>
</div>
