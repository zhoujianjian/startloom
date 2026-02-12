<template>
  <div class="page">
    <main class="container">
      <section class="hero">
        <h1>Tarot Card Meanings</h1>
        <p>Browse the Major Arcana and Minor Arcana. Fast meanings, keywords, and quick reflections.</p>
      </section>

      <AdSlot height="120px" />

      <section class="search">
        <input v-model="q" type="text" placeholder="Search a card (e.g. The Fool, Ace of Cups)" />
      </section>

      <section class="sections">
        <h2>Major Arcana</h2>
        <div class="grid">
          <router-link
            v-for="c in filteredMajor"
            :key="c.slug"
            class="card"
            :to="`/en/tarot/cards/${c.slug}`"
          >
            <div class="name">{{ c.name }}</div>
            <div class="meta">{{ c.keywords.join(' · ') }}</div>
          </router-link>
        </div>

        <h2>Minor Arcana</h2>
        <div class="minor">
          <div class="suits">
            <button
              v-for="s in suits"
              :key="s"
              class="suit"
              :class="{ active: activeSuit === s }"
              @click="activeSuit = s"
            >
              {{ s }}
            </button>
          </div>

          <div class="grid">
            <router-link
              v-for="c in filteredMinor"
              :key="c.slug"
              class="card"
              :to="`/en/tarot/cards/${c.slug}`"
            >
              <div class="name">{{ c.name }}</div>
              <div class="meta">{{ c.keywords.join(' · ') }}</div>
            </router-link>
          </div>
        </div>
      </section>

      <AdSlot height="160px" />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdSlot from '../../components/Western/AdSlot.vue'
import { setSEO, setCanonical, setBreadcrumb, setHreflang } from '../../utils/seo'

const q = ref('')
const activeSuit = ref('Cups')
const route = useRoute()

const suits = ['Cups', 'Wands', 'Swords', 'Pentacles']

const major = [
  { slug: 'the-fool', name: 'The Fool', keywords: ['beginnings', 'faith', 'leap'] },
  { slug: 'the-magician', name: 'The Magician', keywords: ['will', 'manifest', 'skill'] },
  { slug: 'the-high-priestess', name: 'The High Priestess', keywords: ['intuition', 'mystery', 'inner'] },
  { slug: 'the-empress', name: 'The Empress', keywords: ['creation', 'nurture', 'abundance'] },
  { slug: 'the-emperor', name: 'The Emperor', keywords: ['structure', 'order', 'authority'] },
  { slug: 'the-hierophant', name: 'The Hierophant', keywords: ['tradition', 'learning', 'values'] },
  { slug: 'the-lovers', name: 'The Lovers', keywords: ['choice', 'union', 'alignment'] },
  { slug: 'the-chariot', name: 'The Chariot', keywords: ['drive', 'victory', 'control'] },
  { slug: 'strength', name: 'Strength', keywords: ['courage', 'patience', 'heart'] },
  { slug: 'the-hermit', name: 'The Hermit', keywords: ['wisdom', 'solitude', 'truth'] },
  { slug: 'wheel-of-fortune', name: 'Wheel of Fortune', keywords: ['change', 'cycles', 'luck'] },
  { slug: 'justice', name: 'Justice', keywords: ['truth', 'balance', 'karma'] },
  { slug: 'the-hanged-man', name: 'The Hanged Man', keywords: ['pause', 'surrender', 'view'] },
  { slug: 'death', name: 'Death', keywords: ['ending', 'rebirth', 'release'] },
  { slug: 'temperance', name: 'Temperance', keywords: ['harmony', 'healing', 'flow'] },
  { slug: 'the-devil', name: 'The Devil', keywords: ['bondage', 'shadow', 'desire'] },
  { slug: 'the-tower', name: 'The Tower', keywords: ['shock', 'truth', 'breakthrough'] },
  { slug: 'the-star', name: 'The Star', keywords: ['hope', 'inspire', 'renew'] },
  { slug: 'the-moon', name: 'The Moon', keywords: ['illusion', 'dreams', 'fear'] },
  { slug: 'the-sun', name: 'The Sun', keywords: ['joy', 'success', 'clarity'] },
  { slug: 'judgement', name: 'Judgement', keywords: ['awakening', 'calling', 'review'] },
  { slug: 'the-world', name: 'The World', keywords: ['completion', 'integration', 'travel'] },
]

const minor = computed(() => {
  const ranks = [
    { k: 'ace', n: 'Ace' },
    { k: 'two', n: 'Two' },
    { k: 'three', n: 'Three' },
    { k: 'four', n: 'Four' },
    { k: 'five', n: 'Five' },
    { k: 'six', n: 'Six' },
    { k: 'seven', n: 'Seven' },
    { k: 'eight', n: 'Eight' },
    { k: 'nine', n: 'Nine' },
    { k: 'ten', n: 'Ten' },
    { k: 'page', n: 'Page' },
    { k: 'knight', n: 'Knight' },
    { k: 'queen', n: 'Queen' },
    { k: 'king', n: 'King' },
  ]

  const rankKeywords = {
    ace: ['new start', 'seed', 'potential'],
    two: ['choice', 'balance', 'duality'],
    three: ['growth', 'collaboration', 'expansion'],
    four: ['stability', 'rest', 'foundation'],
    five: ['conflict', 'change', 'challenge'],
    six: ['harmony', 'support', 'healing'],
    seven: ['test', 'strategy', 'faith'],
    eight: ['movement', 'progress', 'mastery'],
    nine: ['wish', 'resilience', 'near completion'],
    ten: ['completion', 'outcome', 'threshold'],
    page: ['curiosity', 'messages', 'learning'],
    knight: ['action', 'quest', 'drive'],
    queen: ['embody', 'nurture', 'maturity'],
    king: ['leadership', 'mastery', 'direction'],
  }

  const suitKeywords = {
    Cups: ['love', 'feelings', 'connection'],
    Wands: ['action', 'passion', 'growth'],
    Swords: ['thought', 'truth', 'choice'],
    Pentacles: ['money', 'work', 'stability'],
  }

  const res = []
  for (const s of suits) {
    for (const r of ranks) {
      res.push({
        slug: `${r.k}-of-${s.toLowerCase()}`,
        name: `${r.n} of ${s}`,
        suit: s,
        keywords: [...(rankKeywords[r.k] || []), ...(suitKeywords[s] || [])],
      })
    }
  }
  return res
})

const filteredMajor = computed(() => {
  const k = q.value.trim().toLowerCase()
  if (!k) return major
  return major.filter(c => c.name.toLowerCase().includes(k) || c.keywords.join(' ').includes(k))
})

const filteredMinor = computed(() => {
  const k = q.value.trim().toLowerCase()
  const list = minor.value.filter(c => c.suit === activeSuit.value)
  if (!k) return list
  return list.filter(c => c.name.toLowerCase().includes(k) || c.keywords.join(' ').includes(k))
})

onMounted(() => {
  setSEO('home', {
    title: 'Tarot Card Meanings (78 Cards) | StarLoom',
    description: 'Browse tarot card meanings for the Major Arcana and Minor Arcana. Keywords, upright and reversed insights, and quick reflections — free and mobile-friendly.',
    keywords: 'tarot card meanings, tarot cards, major arcana, minor arcana, upright meaning, reversed meaning'
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tarot Cards', url: 'https://ibazi.site/en/tarot/cards' }
  ])
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
}

.hero {
  margin-bottom: 14px;

  h1 {
    margin: 0 0 8px;
    font-size: 2.05rem;
  }

  p {
    margin: 0;
    color: $text-secondary;
    font-size: 1.05rem;
    line-height: 1.7;
  }
}

.search {
  margin: 14px 0 18px;

  input {
    width: 100%;
    padding: 12px 12px;
    background-color: $bg-secondary;
    border: 2px solid rgba($primary-gold, 0.18);
    border-radius: 14px;
    color: $text-primary;
    font-size: 1.02rem;
  }
}

.sections {
  h2 {
    margin: 18px 0 10px;
    font-size: 1.25rem;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.card {
  background: $bg-secondary;
  border: 1px solid rgba($primary-gold, 0.12);
  border-radius: 16px;
  padding: 14px;
  text-decoration: none;
  color: inherit;

  .name {
    font-weight: 800;
    margin-bottom: 6px;
    font-size: 1.06rem;
  }

  .meta {
    color: $text-secondary;
    font-size: 0.98rem;
    line-height: 1.65;
  }
}

.minor {
  background: rgba($primary-gold, 0.04);
  border: 1px solid rgba($primary-gold, 0.1);
  border-radius: 18px;
  padding: 12px;
}

.suits {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.suit {
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba($primary-gold, 0.18);
  background: rgba($primary-gold, 0.06);
  color: $text-primary;
  cursor: pointer;
}

.suit.active {
  background: $gradient-purple-gold;
  border-color: rgba($primary-gold, 0.25);
}

@media (min-width: 720px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 980px) {
  .grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
