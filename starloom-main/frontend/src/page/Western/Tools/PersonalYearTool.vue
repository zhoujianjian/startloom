<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tools">Tools</router-link>
        <span>/</span>
        <span>Personal Year</span>
      </nav>

      <section class="hero">
        <h1>Personal Year Number Calculator</h1>
        <p>Enter your birth date to get your Personal Year Number and a simple theme for the year ahead.</p>
      </section>

      <AdSlot height="120px" />

      <section class="card">
        <div class="row">
          <label>Birth date</label>
          <input v-model="birthDate" type="date" />
        </div>

        <button class="btn" type="button" @click="calculate">Calculate</button>

        <div v-if="result" class="result">
          <div class="big">{{ result.number }}</div>
          <div class="text">{{ result.text }}</div>

          <div class="next">
            <div class="nextTitle">Next steps</div>
            <div class="nextGrid">
              <router-link class="nextItem" to="/en/tarot-reading">Get a tarot reading</router-link>
              <router-link class="nextItem" to="/en/compatibility">Check compatibility</router-link>
              <router-link class="nextItem" to="/en/numerology">Explore numerology</router-link>
            </div>
          </div>
        </div>
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
const birthDate = ref('')
const result = ref(null)

const reduceToDigit = (n) => {
  let x = Math.abs(Number(n) || 0)
  const keep = new Set([11, 22, 33])
  while (x > 9 && !keep.has(x)) {
    x = String(x)
      .split('')
      .reduce((sum, c) => sum + Number(c), 0)
  }
  return x
}

const personalYearFromBirthDate = (birthDateStr) => {
  const digits = String(birthDateStr || '').replaceAll('-', '')
  const now = new Date()
  const n =
    Number(String(now.getFullYear())) +
    Number(String(now.getMonth() + 1)) +
    Number(String(now.getDate())) +
    Number(digits.slice(-4) || 0)
  return reduceToDigit(n)
}

const desc = (num) => {
  const map = {
    1: 'A year for fresh starts, leadership, and taking initiative. Pick one bold priority and begin.',
    2: 'A year for relationships, patience, and cooperation. Focus on communication and emotional balance.',
    3: 'A year for creativity, visibility, and self-expression. Share your ideas and build momentum.',
    4: 'A year for stability and foundations. Improve systems, habits, and long-term structure.',
    5: 'A year of change and freedom. Stay flexible, explore opportunities, and avoid impulsive decisions.',
    6: 'A year for responsibility, home, and care. Strengthen relationships and commitments.',
    7: 'A year for reflection, learning, and inner growth. Slow down, study, and listen to intuition.',
    8: 'A year for achievement, money, and power. Focus on results, boundaries, and smart decisions.',
    9: 'A year for completion and release. Finish what you started and make space for a new chapter.',
    11: 'A year for intuition and inspiration. Notice synchronicities and trust your creative guidance.',
    22: 'A year to build something meaningful. Think long-term, stay grounded, and execute step by step.',
    33: 'A year of service and compassion. Teach, support, and lead with heart.'
  }
  return map[num] || 'A year for balance and growth. Focus on one clear theme and keep steady progress.'
}

const calculate = () => {
  if (!birthDate.value) {
    result.value = null
    return
  }
  const n = personalYearFromBirthDate(birthDate.value)
  result.value = { number: n, text: desc(n) }
}

onMounted(() => {
  setSEO('home', {
    title: 'Personal Year Number Calculator | StarLoom',
    description: 'Calculate your Personal Year Number and get a simple numerology theme for the year ahead. Free and beginner-friendly.',
    keywords: 'personal year number calculator, personal year numerology, numerology forecast'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tools', url: 'https://ibazi.site/en/tools' },
    { name: 'Personal Year', url: `https://ibazi.site${route.path}` }
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

  .big {
    font-size: 2.4rem;
    font-weight: 900;
    margin-bottom: 8px;
  }

  .text {
    font-size: 1.05rem;
  }
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
  .nextGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
