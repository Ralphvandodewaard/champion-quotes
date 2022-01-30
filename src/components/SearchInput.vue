<template>
  <div class="relative w-80">
    <label
      for="search"
      class="absolute top-0 left-0 flex items-center h-full pl-4"
    >
      <img
        src="@/assets/icons/search.svg"
        alt="Search icon"
        class="w-4 h-4"
      >
    </label>
    <input
      type="text"
      id="search"
      ref="search"
      :value="modelValue"
      placeholder="Search champion.."
      autocomplete="off"
      class="w-full pl-10 pr-8 h-12 border-2 border-gray-300 bg-transparent placeholder-gray-400 text-white hover:border-white focus:border-white duration-200 rounded-full outline-none"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <label
      v-if="modelValue"
      for="search"
      class="absolute top-0 right-0 flex items-center h-full pr-4"
    >
      <img
        src="@/assets/icons/cross.svg"
        alt="Cross icon"
        @click="clearInput"
        class="w-3 h-3"
      >
    </label>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'on-clear-input']
})

export default class SearchInput extends Vue {
  clearInput(): void {
    this.$emit('on-clear-input');
    (this.$refs.search as any).focus();
  }
}
</script>
