<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Chakra Quiz</span>
      </nav>

      <section class="hero">
        <h1>Chakra Quiz</h1>
        <p>A quick 3-question check-in to suggest a focus chakra for today.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>Mind</label>
          <select v-model.number="mind">
            <option :value="1">Foggy</option>
            <option :value="2">Okay</option>
            <option :value="3">Clear</option>
          </select>
        </div>

        <div class="row">
          <label>Body</label>
          <select v-model.number="body">
            <option :value="1">Tense</option>
            <option :value="2">Balanced</option>
            <option :value="3">Energized</option>
          </select>
        </div>

        <div class="row">
          <label>Emotion</label>
          <select v-model.number="emotion">
            <option :value="1">Heavy</option>
            <option :value="2">Steady</option>
            <option :value="3">Open</option>
          </select>
        </div>

        <button class="btn" type="button" @click="submit">Get result</button>

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
import { setSEO, setCanonical, setBreadcrumb, setHreflang, setStructuredData } from '../../../utils/seo'

const route = useRoute()
const mind = ref(2)
const body = ref(2)
const emotion = ref(2)
const result = ref('')

const submit = () => {
  const total = Number(mind.value || 0) + Number(body.value || 0) + Number(emotion.value || 0)
  if (total <= 5) {
    result.value = 'Your energy is low. Focus on Root + Solar Plexus: sleep, nutrition, and one small daily goal.'
    return
  }
  if (total <= 7) {
    result.value = 'You’re balanced but sensitive. Focus on Heart + Throat: honest feelings and gentle communication.'
    return
  }
  result.value = 'Your energy is strong. Focus on Third Eye + Crown: meditation, journaling, and intuitive practice.'
}

onMounted(() => {
  submit()
  setSEO('home', {
    title: 'Chakra Quiz | StarLoom',
    description: 'A quick chakra quiz to suggest a focus chakra for today. Free, simple, and mobile-friendly.',
    keywords: 'chakra quiz, chakra balance, energy centers'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Chakra Quiz', url: `https://ibazi.site${route.path}` },
  ])
  setStructuredData('faq', {
    questions: [
      {
        question: 'Is this chakra quiz accurate?',
        answer: 'It’s a light reflection tool. Use it to notice patterns and choose a gentle practice for the day.',
      },
      {
        question: 'What should I do after the result?',
        answer: 'Pick one small action: breathwork, journaling, a walk, hydration, or a short meditation — then reassess tomorrow.',
      },
    ]
  })
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
  margin-bottom: 10px;

  label {
    font-weight: 700;
    font-size: 1.08rem;
  }

  select {
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
