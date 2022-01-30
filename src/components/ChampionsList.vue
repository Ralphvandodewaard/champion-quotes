<template>
  <div class="flex flex-wrap gap-4 sm:gap-6 -mt-1 -ml-1 py-1 pl-1 pr-2 md:pr-4 overflow-y-auto">
    <button
      v-for="champion in filteredChampions"
      :key="champion.id"
      :disabled="isSelected"
      @click="selectChampion(champion)"
      :class="isSelected ? 'cursor-default' : 'transform hover:scale-102 duration-200'"
      class="flex justify-center items-center h-16 sm:h-20 w-16 sm:w-20 border-2 border-nearblack rounded outline-none overflow-hidden"
    >
      <img
        :src="champion.image"
        :alt="champion.name"
        :class="isSelected ? '' : 'filter hover:brightness-125 duration-200'"
        class="w-18 sm:w-22 h-18 sm:h-22 max-w-none"
      >
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Champion } from '@/models/Champion';

@Options({
  props: {
    champions: {
      type: Array,
      required: true
    },
    searchInputValue: {
      type: String,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  }
})

export default class ChampionsList extends Vue {
  champions!: Champion[];

  searchInputValue!: string;

  get filteredChampions(): Champion[] {
    return this.champions.filter((champion: Champion) => {
      return champion.name.toLowerCase().includes(this.searchInputValue.toLowerCase()) ||
      champion.name_id.toLowerCase().includes(this.searchInputValue.toLowerCase());
    });
  }

  selectChampion(champion: Champion): void {
    this.$emit('on-select-champion', champion);
  }
}
</script>

<style lang="postcss">
div::-webkit-scrollbar {
  @apply w-2;
}

div::-webkit-scrollbar-track {
  @apply bg-transparent rounded-lg my-1;
}

div::-webkit-scrollbar-thumb {
  @apply bg-nearblack rounded-lg;
}
</style>
