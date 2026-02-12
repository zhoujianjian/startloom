<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Rising Sign</span>
      </nav>

      <section class="hero">
        <h1>Rising Sign (Ascendant) Calculator</h1>
        <p>Enter birth date, time, and location to estimate your Rising sign. Use it as a reflective guide.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>Birth date</label>
          <input v-model="birthDate" type="date" />
        </div>

        <div class="row">
          <label>Birth time</label>
          <input v-model="birthTime" type="time" />
        </div>

        <div class="row">
          <label>Birth location</label>
          <input v-model="birthLocation" type="text" placeholder="City, Country" />
        </div>

        <button class="btn" type="button" @click="generate">Generate</button>

        <div v-if="chart" class="result">
          <div class="grid">
            <div class="item">
              <div class="k">Sun sign</div>
              <div class="v">{{ chart.sunSign }}</div>
            </div>
            <div class="item">
              <div class="k">Moon sign</div>
              <div class="v">{{ chart.moonSign }}</div>
            </div>
            <div class="item">
              <div class="k">Rising sign</div>
              <div class="v">{{ chart.risingSign }}</div>
            </div>
          </div>

          <div class="note">
            For best accuracy, use an exact birth time. If your birth time is unknown, treat this as a rough guide.
          </div>

          <div class="next">
            <div class="nextTitle">Next steps</div>
            <div class="nextGrid">
              <router-link class="nextItem" to="/en/birth-chart">Full birth chart</router-link>
              <router-link class="nextItem" to="/en/compatibility">Check compatibility</router-link>
              <router-link class="nextItem" to="/en/tarot-reading">Get a tarot reading</router-link>
            </div>
          </div>
        </div>
      </section>

      <AdSlot height="160px" />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import AdSlot from '../../../components/Western/AdSlot.vue'
import { setSEO, setCanonical, setBreadcrumb, setHreflang } from '../../../utils/seo'

const store = useStore()
const route = useRoute()

const birthDate = ref('')
const birthTime = ref('')
const birthLocation = ref('')

const chart = computed(() => store.state.western.birthChart)

const generate = async () => {
  if (!birthDate.value) return
  await store.dispatch('western/fetchBirthChart', {
    birthDate: birthDate.value,
    birthTime: birthTime.value,
    birthLocation: birthLocation.value
  })
}

onMounted(() => {
  setSEO('home', {
    title: 'Rising Sign Calculator | Ascendant Sign | StarLoom',
    description: 'Generate an estimated Rising sign (Ascendant) using your birth date, time, and location. Free and beginner-friendly.',
    keywords: 'rising sign calculator, ascendant sign, find my rising sign'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Rising Sign', url: `https://ibazi.site${route.path}` }
  ])
})
</script>

<style scoped lang="scss">
@import '../../../assets/scss/main.scss';

.page {
  background: $bg-primary;
  color: $text-primary;
  min-height: 100vh;
}

.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 22px 16px 60px;
}

.crumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: $text-secondary;
  margin-bottom: 12px;
  font-size: 1.02rem;

  a {
    color: $text-secondary;
    text-decoration: none;
  }
}

.hero {
  margin-bottom: 18px;

  h1 {
    margin: 0 0 8px;
    font-size: 2rem;
  }

  p {
    margin: 0;
    color: $text-secondary;
    font-size: 1.05rem;
    line-height: 1.7;
  }
}

.card {
  margin-top: 18px;
  background: $bg-secondary;
  border: 1px solid rgba($primary-gold, 0.12);
  border-radius: 18px;
  padding: 16px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  label {
    font-weight: 800;
    font-size: 1.08rem;
  }

  input {
    min-width: 240px;
    padding: 12px 12px;
    border-radius: 12px;
    border: 2px solid rgba($primary-gold, 0.18);
    background: $bg-primary;
    color: $text-primary;
    font-size: 1.02rem;
  }
}

.btn {
  margin-top: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: $gradient-purple-gold;
  color: $text-primary;
  font-weight: 800;
  cursor: pointer;
  font-size: 1rem;
}

.result {
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba($primary-gold, 0.08);
  border: 1px solid rgba($primary-gold, 0.16);
  color: rgba($text-primary, 0.92);
  line-height: 1.75;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.item {
  background: rgba($primary-gold, 0.06);
  border: 1px solid rgba($primary-gold, 0.12);
  border-radius: 14px;
  padding: 12px;

  .k {
    font-size: 0.92rem;
    color: $text-secondary;
    margin-bottom: 6px;
  }

  .v {
    font-size: 1.25rem;
    font-weight: 900;
  }
}

.note {
  margin-top: 12px;
  font-size: 1rem;
  color: $text-secondary;
}

.next {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba($primary-gold, 0.16);
}

.nextTitle {
  font-weight: 900;
  margin-bottom: 10px;
  font-size: 1.02rem;
}

.nextGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.nextItem {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  font-weight: 900;
  text-decoration: none;
  border: 1px solid rgba($primary-gold, 0.2);
  background: rgba($primary-gold, 0.1);
  color: $text-primary;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .nextGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
