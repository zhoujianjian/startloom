<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/compatibility">Compatibility</router-link>
        <span>/</span>
        <span>{{ title }}</span>
      </nav>

      <section class="hero">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </section>

      <AdSlot height="120px" />

      <section class="result">
        <div class="score">
          <div class="value">{{ score }}</div>
          <div class="label">Compatibility Score</div>
        </div>

        <div class="cards">
          <div class="card">
            <h3>Strengths</h3>
            <ul>
              <li v-for="(s, idx) in strengths" :key="idx">{{ s }}</li>
            </ul>
          </div>
          <div class="card">
            <h3>Challenges</h3>
            <ul>
              <li v-for="(s, idx) in challenges" :key="idx">{{ s }}</li>
            </ul>
          </div>
        </div>

        <div class="cta">
          <router-link class="btn" to="/en/compatibility">Check another pairing</router-link>
          <button class="btn secondary" @click="copyLink">Copy link</button>
        </div>
      </section>

      <AdSlot height="160px" />

      <section class="faq">
        <h2>FAQ</h2>
        <details>
          <summary>Is this accurate?</summary>
          <p>Compatibility is for entertainment and reflection. Use it as a conversation starter, not a verdict.</p>
        </details>
        <details>
          <summary>What if I don’t know my partner’s sign?</summary>
          <p>Use their birthday to find the Sun sign, then come back to compare.</p>
        </details>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdSlot from '../../components/Western/AdSlot.vue'
import { setSEO, setCanonical, setBreadcrumb, setStructuredData, setHreflang } from '../../utils/seo'

const route = useRoute()

const signs = [
  { key: 'aries', name: 'Aries', element: 'fire' },
  { key: 'taurus', name: 'Taurus', element: 'earth' },
  { key: 'gemini', name: 'Gemini', element: 'air' },
  { key: 'cancer', name: 'Cancer', element: 'water' },
  { key: 'leo', name: 'Leo', element: 'fire' },
  { key: 'virgo', name: 'Virgo', element: 'earth' },
  { key: 'libra', name: 'Libra', element: 'air' },
  { key: 'scorpio', name: 'Scorpio', element: 'water' },
  { key: 'sagittarius', name: 'Sagittarius', element: 'fire' },
  { key: 'capricorn', name: 'Capricorn', element: 'earth' },
  { key: 'aquarius', name: 'Aquarius', element: 'air' },
  { key: 'pisces', name: 'Pisces', element: 'water' },
]

const getSign = (key) => signs.find(s => s.key === String(key || '').toLowerCase())

const signA = computed(() => getSign(route.params.signA) || signs[0])
const signB = computed(() => getSign(route.params.signB) || signs[1])

const title = computed(() => `${signA.value.name} and ${signB.value.name} Compatibility`)
const subtitle = computed(() => `A quick compatibility snapshot for ${signA.value.name} + ${signB.value.name}.`) 

const score = computed(() => {
  const a = signA.value.element
  const b = signB.value.element
  if (a === b) return 82
  const pairs = new Set([`${a}-${b}`, `${b}-${a}`])
  if (pairs.has('fire-air')) return 88
  if (pairs.has('earth-water')) return 86
  if (pairs.has('fire-water')) return 66
  if (pairs.has('earth-air')) return 64
  return 72
})

const strengths = computed(() => {
  const a = signA.value.element
  const b = signB.value.element
  if (a === b) return ['You naturally understand each other’s pace', 'Shared values make decisions easier', 'Strong sense of “us”']
  const pairs = new Set([`${a}-${b}`, `${b}-${a}`])
  if (pairs.has('fire-air')) return ['Fun, playful chemistry', 'Strong momentum and motivation', 'You inspire each other to grow']
  if (pairs.has('earth-water')) return ['Emotional safety + stability', 'Strong long-term potential', 'Practical support in daily life']
  if (pairs.has('fire-water')) return ['Powerful attraction', 'Emotional depth can be healing', 'You challenge comfort zones']
  if (pairs.has('earth-air')) return ['Balance of ideas and execution', 'Good teamwork potential', 'You learn each other’s language']
  return ['Good balance with conscious communication', 'Complementary strengths', 'Room to build a unique dynamic']
})

const challenges = computed(() => {
  const a = signA.value.element
  const b = signB.value.element
  if (a === b) return ['Too similar can feel stagnant', 'Conflicts may mirror each other', 'Need novelty to stay excited']
  const pairs = new Set([`${a}-${b}`, `${b}-${a}`])
  if (pairs.has('fire-air')) return ['Arguments can escalate fast', 'Air can feel “too detached” to Fire', 'Need clarity about boundaries']
  if (pairs.has('earth-water')) return ['Water may feel Earth is too practical', 'Earth may feel overwhelmed by emotions', 'Avoid silent resentment']
  if (pairs.has('fire-water')) return ['Different emotional tempo', 'Mood swings vs. spontaneity', 'Need rules for conflict']
  if (pairs.has('earth-air')) return ['Different priorities', 'Air wants freedom, Earth wants structure', 'Need shared routines']
  return ['Miscommunication under stress', 'Different needs for space/attention', 'Work on trust and timing']
})

const copyLink = async () => {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
  } catch (e) {
    const el = document.createElement('textarea')
    el.value = url
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}

onMounted(() => {
  const pageTitle = `${title.value} | StarLoom`
  const pageDesc = `Explore ${signA.value.name} + ${signB.value.name} compatibility: score, strengths, challenges, and a quick FAQ. Free astrology tool for reflection.`
  setSEO('home', {
    title: pageTitle,
    description: pageDesc,
    keywords: `${signA.value.name} and ${signB.value.name} compatibility, zodiac compatibility, astrology love match`
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Compatibility', url: 'https://ibazi.site/en/compatibility' },
    { name: title.value, url: `https://ibazi.site${route.path}` }
  ])
  setStructuredData('faq', {
    questions: [
      {
        question: `Is ${signA.value.name} and ${signB.value.name} compatibility accurate?`,
        answer: 'Compatibility is for entertainment and reflection. Use it as a conversation starter, not a verdict.',
      },
      {
        question: `What makes ${signA.value.name} and ${signB.value.name} work?`,
        answer: strengths.value.join(' '),
      },
      {
        question: `What are the biggest challenges for ${signA.value.name} + ${signB.value.name}?`,
        answer: challenges.value.join(' '),
      },
    ],
  })
})
</script>

<style scoped lang="scss">
@import '../../assets/scss/main.scss';

.page {
  background: $bg-primary;
  color: $text-primary;
  min-height: 100vh;
}

.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 22px 16px 60px;
  font-size: 16px;
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
    font-size: 1.7rem;
  }

  p {
    margin: 0;
    color: $text-secondary;
    font-size: 1rem;
    line-height: 1.7;
  }
}

.result {
  margin-top: 18px;
  background: $bg-secondary;
  border: 1px solid rgba($primary-gold, 0.12);
  border-radius: 18px;
  padding: 16px;
}

.score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  padding: 10px 0 16px;
  border-bottom: 1px solid rgba($primary-gold, 0.12);

  .value {
    font-size: 2.2rem;
    font-weight: 800;
    color: $primary-gold;
  }

  .label {
    color: $text-secondary;
    font-size: 1rem;
  }
}

.cards {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.card {
  background: $bg-primary;
  border-radius: 16px;
  border: 1px solid rgba($primary-gold, 0.1);
  padding: 14px;

  h3 {
    margin: 0 0 10px;
    font-size: 1.1rem;
  }

  ul {
    margin: 0;
    padding-left: 18px;
    color: $text-secondary;

    li {
      font-size: 0.98rem;
      line-height: 1.65;
    }
  }
}

.cta {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: $gradient-purple-gold;
  color: $text-primary;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
}

.btn.secondary {
  background: rgba($primary-gold, 0.12);
  border: 1px solid rgba($primary-gold, 0.2);
}

.faq {
  margin-top: 20px;

  h2 {
    font-size: 1.1rem;
    margin: 0 0 10px;
  }

  details {
    background: rgba($primary-gold, 0.06);
    border: 1px solid rgba($primary-gold, 0.12);
    border-radius: 14px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }

  summary {
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
  }

  p {
    margin: 10px 0 0;
    color: $text-secondary;
    font-size: 0.98rem;
    line-height: 1.7;
  }
}

@media (min-width: 860px) {
  .cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1200px) {
  .container {
    font-size: 17px;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .score .value {
    font-size: 2.6rem;
  }
}
</style>
