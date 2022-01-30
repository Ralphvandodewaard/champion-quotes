<template>
  <div
    v-if="!loading"
    class="flex flex-col flex-grow gap-4 sm:gap-8 p-4 sm:p-8"
  >
    <div class="flex flex-col text-xl font-semibold text-white">
      <p class="text-sm">
        High score:
        {{ highScore }}
      </p>
      <p>
        Score:
        {{ currentScore }}
      </p>
    </div>
    <div class="flex flex-col items-center gap-12 sm:gap-20 px-0 lg:px-32 pb-0 lg:pb-12 overflow-y-auto">
      <div class="flex flex-col items-center gap-8 w-3/5 lg:w-4/5 max-w-xl">
        <div class="text-2xl font-semibold text-white text-center ">
          <h2 v-if="!selectedChampion">
            Which champion says this voice line?
          </h2>
          <h2 v-if="selectedChampion">
            The correct answer is <span :class="isCorrect ? 'text-green' : 'text-red'">{{ activeChampion.name }}</span>!
          </h2>
        </div>
        <div
          :class="selectedChampion ? `${isCorrect ? 'border-green' : 'border-red'} duration-500` : 'border-white'"
          class="relative flex justify-center items-center w-full h-40 p-4 border-2 rounded shadow"
        >
          <div
            :style="backgroundImageStyle"
            :class="`${selectedChampion ? 'opacity-100 duration-500' : 'opacity-0'} ${backgroundImagePosition}`"
            class="absolute inset-0 bg-cover"
          />
          <div class="flex flex-col items-center gap-2 z-10">
            <p
              :class="selectedChampion ? `${isCorrect ? 'text-green' : 'text-red'} text-shadow duration-500` : 'text-white'"
              class="text-xl font-semibold text-center italic"
            >
              "{{ activeChampion.quotes.pick }}"
            </p>
            <div class="hidden">
              <audio preload="auto">
                <source type="audio/ogg" :src="audioSrc">
                Your browser does not support the audio tag
              </audio>
            </div>
          </div>
          <button
            @click="reset"
            :disabled="!selectedChampion"
            :class="selectedChampion ? `${isCorrect ? 'border-green' : 'border-red'} opacity-100 duration-200` : 'border-transparent cursor-default opacity-0'"
            class="absolute -right-16 sm:-right-24 w-12 sm:w-16 h-12 sm:h-16 p-2 sm:p-3 border-2 rounded-full transform hover:scale-102 filter hover:brightness-125"
          >
            <img
              v-if="isCorrect"
              class="h-full w-full"
              src="../assets/icons/arrow-right.svg"
            >
            <img
              v-if="!isCorrect"
              class="h-full w-full"
              src="../assets/icons/reset.svg"
            >
          </button>
        </div>
      </div>
      <div class="flex flex-col items-center gap-8 overflow-y-auto">
        <SearchInput
          v-model="searchInputValue"
          @on-clear-input="clearInput"
        />
        <ChampionsList
          :champions="champions"
          :search-input-value="searchInputValue"
          :is-selected="selectedChampion ? true : false"
          @on-select-champion="selectChampion"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from 'axios';
import championQuotes from '@/assets/data/champion-quotes.json';
import ChampionsList from '@/components/ChampionsList.vue';
import SearchInput from '@/components/SearchInput.vue';
import { Champion } from '@/models/Champion';

@Options({
  components: {
    SearchInput,
    ChampionsList
  }
})
export default class Home extends Vue {
  ddragonUrl = 'https://ddragon.leagueoflegends.com';

  communitydragonUrl = 'https://cdn.communitydragon.org';

  loading = true;

  patchVersion = '';

  champions: Champion[] = [];

  activeChampion: Champion | null = null;

  selectedChampion: Champion | null = null;

  searchInputValue = '';

  highScore = 0;

  currentScore = 0;

  get backgroundImageStyle(): any {
    const gradient = 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))';
    const url = `${this.ddragonUrl}/cdn/img/champion/splash/${this.activeChampion?.name_id}_0.jpg`;

    return { backgroundImage: `${gradient}, url(${url})` };
  }

  get backgroundImagePosition(): string {
    switch (this.activeChampion?.name) {
      case 'Miss Fortune':
      case 'Corki':
      case 'Amumu':
      case 'Kennen':
      case 'Lucian':
      case 'Olaf':
      case 'Cassiopeia':
      case 'Heimerdinger':
      case 'Zac':
      case 'Skarner':
      case 'Rengar':
      case "Kog'Maw":
      case 'Kayn':
      case 'Warwick':
      case 'Yasuo':
      case 'Anivia':
      case 'Malphite':
      case "Kha'Zix":
      case 'Tahm Kench':
      case 'Ornn':
      case "Vel'Koz":
      case 'Master Yi':
      case 'Nocturne':
      case 'Alistar':
      case 'Maokai':
      case 'Udyr':
      case 'Ryze':
      case 'Jayce':
      case 'Rammus':
      case "Rek'Sai":
      case 'Nunu & Willump':
      case 'Ziggs':
      case 'Akshan':
      case 'Gnar':
      case 'Katarina':
      case 'Kindred':
      case 'Lulu':
      case 'Talon':
        return 'bg-center';
      default:
        return 'bg-top';
    }
  }

  get audioSrc(): string {
    return `${this.communitydragonUrl}/11.23.1/champion/${this.activeChampion?.id}/champ-select/sounds/choose`;
  }

  get isCorrect(): boolean {
    return this.activeChampion?.id === this.selectedChampion?.id;
  }

  async mounted(): Promise<void> {
    this.loading = true;
    await this.fetchPatchVersion();
    await this.fetchChampions();
    this.highScore = localStorage.getItem('highScore') ? Number(localStorage.getItem('highScore')) : 0;
    this.setActiveChampion();
    this.loading = false;
  }

  async fetchPatchVersion(): Promise<void> {
    await axios.get(`${this.ddragonUrl}/api/versions.json`).then((response) => {
      this.patchVersion = response.data[0];
    });
  }

  async fetchChampions(): Promise<void> {
    await axios.get(`${this.ddragonUrl}/cdn/${this.patchVersion}/data/en_US/champion.json`).then((response) => {
      Object.values(response.data.data).forEach((champion: any) => {
        const payload: Champion = {
          id: champion.key,
          name_id: champion.id,
          name: champion.name,
          image: `${this.ddragonUrl}/cdn/${this.patchVersion}/img/champion/${champion.image.full}`,
          quotes: {
            pick: championQuotes.find(el => el.name === champion.name)?.pick
          }
        };
        this.champions.push(payload);
      });
    });
  }

  setActiveChampion(): void {
    this.activeChampion = this.champions[Math.floor(Math.random() * this.champions.length)];
  }

  selectChampion(champion: Champion): void {
    this.selectedChampion = champion;
    if (this.isCorrect) {
      this.addScore();
    }
  }

  addScore(): void {
    this.currentScore = this.currentScore + 1;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem('highScore', this.highScore.toString());
    }
  }

  clearInput(): void {
    this.searchInputValue = '';
  }

  reset(): void {
    if (!this.isCorrect) {
      this.currentScore = 0;
    }
    this.selectedChampion = null;
    this.searchInputValue = '';
    this.setActiveChampion();
  }
}
</script>
