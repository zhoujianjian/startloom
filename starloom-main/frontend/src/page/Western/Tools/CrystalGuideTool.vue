<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Crystal Guide</span>
      </nav>

      <section class="hero">
        <h1>Crystal Guide</h1>
        <p>Choose an intention and get a simple crystal recommendation.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>Intention</label>
          <select v-model="intention">
            <option value="love">Love</option>
            <option value="focus">Focus</option>
            <option value="protection">Protection</option>
            <option value="sleep">Sleep</option>
            <option value="abundance">Abundance</option>
          </select>
        </div>

        <button class="btn" type="button" @click="recommend">Recommend</button>

        <div v-if="result" class="result">{{ result }}</div>
      </section>

      <AdSlot height="160px" />
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdSlot from '../../../components/Western/AdSlot.vue'
import { setSEO, setCanonical, setBreadcrumb, setHreflang } from '../../../utils/seo'

const route = useRoute()
const intention = ref('love')
const result = ref('')

const map = {
  love: 'Rose Quartz — gentle heart-opening, compassion, self-love.',
  focus: 'Fluorite — clarity, focus, and clean mental boundaries.',
  protection: 'Black Tourmaline — grounding and energetic protection.',
  sleep: 'Amethyst — calm mind, restful sleep, soothing dreams.',
  abundance: 'Citrine — optimism, confidence, and abundance mindset.',
}

const recommend = () => {
  result.value = map[intention.value] || map.love
}

onMounted(() => {
  recommend()
  setSEO('home', {
    title: 'Crystal Guide | StarLoom',
    description: 'Pick an intention and get a quick crystal recommendation. Free crystal guide for beginners.',
    keywords: 'crystal guide, healing crystals, crystal meanings'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Crystal Guide', url: `https://ibazi.site${route.path}` },
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

  a {
    color: $text-secondary;
    text-decoration: none;
  }
}

.hero {
  margin-bottom: 18px;

  h1 {
    margin: 0 0 8px;
    font-size: 1.9rem;
  }

  p {
    margin: 0;
    color: $text-secondary;
    font-size: 1rem;
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

  label {
    font-weight: 700;
    font-size: 1rem;
  }

  select {
    min-width: 240px;
    padding: 12px 12px;
    border-radius: 12px;
    border: 2px solid rgba($primary-gold, 0.18);
    background: $bg-primary;
    color: $text-primary;
  }
}

.btn {
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: $gradient-purple-gold;
  color: $text-primary;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.95rem;
}

.result {
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba($primary-gold, 0.08);
  border: 1px solid rgba($primary-gold, 0.16);
  color: rgba($text-primary, 0.92);
  font-size: 1.05rem;
  line-height: 1.75;
}
</style>
