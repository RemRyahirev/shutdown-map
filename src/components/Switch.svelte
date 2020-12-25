<script lang="ts">
export let offText: string;
export let onText: string;
export let checked = false;
</script>

<label class="inline-flex items-center cursor-pointer select-none">
  {#if offText}
    <span class="mr-3" class:active={!checked}>
      {offText}
    </span>
  {/if}

  <span class="relative">
    <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
    <span
      class="absolute block w-4 h-4 mt-1 ml-1 bg-white rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out"
      class:transform={checked}
      class:translate-x-full={checked}
    >
      <input
        type="checkbox"
        class="absolute opacity-0 w-0 h-0 cursor-pointer"
        bind:checked={checked}
      >
    </span>
  </span>

  {#if onText}
    <span class="ml-3" class:active={checked}>
      {onText}
    </span>
  {/if}
</label>

<style lang="postcss">
.active {
    text-shadow: 0 0 1px currentColor;
}
</style>
