<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Affirmation Generator</span>
      </nav>

      <section class="hero">
        <h1>Affirmation Generator</h1>
        <p>Generate a short affirmation based on your focus for the day.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>Focus</label>
          <select v-model="focus">
            <option value="confidence">Confidence</option>
            <option value="love">Love</option>
            <option value="career">Career</option>
            <option value="healing">Healing</option>
            <option value="calm">Calm</option>
          </select>
        </div>

        <button class="btn" type="button" @click="generate">Generate</button>

        <div v-if="text" class="result">“{{ text }}”</div>
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
const focus = ref('confidence')
const text = ref('')

const bank = {
  confidence: [
    'I trust myself, and I take the next step with courage.',
    'My voice matters. I show up fully and honestly.',
    'I am capable, grounded, and ready for what’s next.',
  ],
  love: [
    'I give and receive love with ease and openness.',
    'I choose relationships that feel safe and true.',
    'My heart is soft, strong, and wisely guided.',
  ],
  career: [
    'I focus on what matters and make steady progress.',
    'I create value, and opportunities meet me halfway.',
    'My work is meaningful, and I grow every day.',
  ],
  healing: [
    'I release what I cannot control and keep what supports me.',
    'I am healing in visible and invisible ways.',
    'Gentleness is strength. I honor my pace.',
  ],
  calm: [
    'I breathe in peace and breathe out tension.',
    'I meet this moment with patience and clarity.',
    'My mind is quiet. My body is safe.',
  ],
}

const generate = () => {
  const list = bank[focus.value] || bank.confidence
  text.value = list[Math.floor(Math.random() * list.length)]
}

onMounted(() => {
  setSEO('home', {
    title: 'Affirmation Generator | StarLoom',
    description: 'Generate a short daily affirmation for confidence, love, career, healing, or calm. Free and mobile-friendly.',
    keywords: 'affirmation generator, daily affirmations, positive affirmations, self love'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Affirmation Generator', url: `https://ibazi.site${route.path}` },
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
