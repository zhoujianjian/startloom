<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Energy Reading</span>
      </nav>

      <section class="hero">
        <h1>Energy Reading</h1>
        <p>Describe how you feel and get a short, reflective energy note.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>How do you feel?</label>
          <input v-model.trim="mood" placeholder="e.g., tired, excited, anxious" />
        </div>

        <button class="btn" type="button" @click="read">Read energy</button>

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
const mood = ref('')
const result = ref('')

const read = () => {
  const m = (mood.value || '').toLowerCase()
  const templates = [
    'Your energy feels steady today. Choose one priority and finish it with care.',
    'Your aura is active — channel it into movement, then rest intentionally.',
    'Your system wants calm. Reduce noise, hydrate, and simplify your next decision.',
    'You’re in a growth wave. Say yes to one brave action and no to distractions.',
  ]

  const hint = m.includes('tired') || m.includes('疲')
    ? 'You feel drained. Start with rest, warm food, and a short walk — then revisit your goal.'
    : m.includes('anx') || m.includes('焦')
      ? 'Anxiety energy is present. Ground with slow breaths and name one controllable next step.'
      : null

  result.value = hint || templates[Math.floor(Math.random() * templates.length)]
}

onMounted(() => {
  read()
  setSEO('home', {
    title: 'Energy Reading | StarLoom',
    description: 'A simple energy reading tool for reflection. Describe how you feel and receive a short, calming note.',
    keywords: 'energy reading, aura reading, spiritual tool'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Energy Reading', url: `https://ibazi.site${route.path}` },
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
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 700;
    font-size: 1rem;
  }

  input {
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
