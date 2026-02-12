<template>
  <div class="page">
    <main class="container">
      <nav class="crumb">
        <router-link to="/en">Home</router-link>
        <span>/</span>
        <router-link to="/en/tarot/cards">Tarot Cards</router-link>
        <span>/</span>
        <span>{{ card.name }}</span>
      </nav>

      <section class="hero">
        <h1>{{ card.name }} Meaning</h1>
        <p class="subtitle">Keywords: <span class="kw">{{ card.keywords.join(', ') }}</span></p>
      </section>

      <AdSlot height="120px" />

      <section class="content">
        <div class="panel">
          <h2>Upright</h2>
          <p>{{ uprightText }}</p>
        </div>

        <div class="panel">
          <h2>Reversed</h2>
          <p>{{ reversedText }}</p>
        </div>

        <div class="panel">
          <h2>Quick Reflection</h2>
          <ul>
            <li v-for="(q, idx) in reflection" :key="idx">{{ q }}</li>
          </ul>
        </div>

        <div class="cta">
          <router-link class="btn" to="/en/tarot">Try a Tarot Reading</router-link>
          <button class="btn secondary" @click="copyLink">Copy link</button>
        </div>
      </section>

      <AdSlot height="160px" />

      <section class="related">
        <h2>Related cards</h2>
        <div class="grid">
          <router-link v-for="r in related" :key="r.slug" class="card" :to="`/en/tarot/cards/${r.slug}`">
            <div class="name">{{ r.name }}</div>
            <div class="meta">{{ r.keywords.join(' · ') }}</div>
          </router-link>
        </div>
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

const majors = [
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

const suits = ['cups', 'wands', 'swords', 'pentacles']
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

const suitThemes = {
  cups: { name: 'Cups', themes: ['love', 'feelings', 'connection'] },
  wands: { name: 'Wands', themes: ['action', 'passion', 'growth'] },
  swords: { name: 'Swords', themes: ['thought', 'truth', 'choice'] },
  pentacles: { name: 'Pentacles', themes: ['money', 'work', 'stability'] },
}

const suitKeywords = {
  cups: ['love', 'feelings', 'connection'],
  wands: ['action', 'passion', 'growth'],
  swords: ['thought', 'truth', 'choice'],
  pentacles: ['money', 'work', 'stability'],
}

const buildMinor = () => {
  const res = []
  for (const s of suits) {
    for (const r of ranks) {
      const suitName = s.charAt(0).toUpperCase() + s.slice(1)
      res.push({
        slug: `${r.k}-of-${s}`,
        name: `${r.n} of ${suitName}`,
        keywords: suitKeywords[s],
      })
    }
  }
  return res
}

const allCards = [...majors, ...buildMinor()]

const minorMeta = computed(() => {
  const slug = String(route.params.slug || '').toLowerCase()
  const m = slug.match(/^(ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king)-of-(cups|wands|swords|pentacles)$/)
  if (!m) return null
  const rank = m[1]
  const suit = m[2]
  const suitInfo = suitThemes[suit] || { name: suit, themes: [] }
  return {
    rank,
    suit,
    suitName: suitInfo.name,
    rankKeywords: rankKeywords[rank] || [],
    suitKeywords: suitInfo.themes || [],
  }
})

const card = computed(() => {
  const slug = String(route.params.slug || '').toLowerCase()
  return allCards.find(c => c.slug === slug) || { slug, name: 'Tarot Card', keywords: ['tarot'] }
})

const uprightText = computed(() => {
  const k = card.value.keywords.join(', ')
  if (minorMeta.value) {
    const r = minorMeta.value.rank
    const s = minorMeta.value.suitName
    const rk = minorMeta.value.rankKeywords.join(', ')
    const sk = minorMeta.value.suitKeywords.join(', ')
    return `Upright, ${card.value.name} highlights ${rk} expressed through the element of ${s} (${sk}). It points to what is developing now and the most helpful next step you can take.`
  }
  return `Upright, ${card.value.name} points to ${k}. It highlights what is opening up for you now, and what becomes possible when you act with clarity and intention.`
})

const reversedText = computed(() => {
  const k = card.value.keywords.join(', ')
  if (minorMeta.value) {
    const r = minorMeta.value.rank
    const s = minorMeta.value.suitName
    const rk = minorMeta.value.rankKeywords.join(', ')
    const sk = minorMeta.value.suitKeywords.join(', ')
    return `Reversed, ${card.value.name} can signal a blocked or imbalanced expression of ${rk} in the realm of ${s} (${sk}). It may suggest hesitation, misalignment, or a need to slow down and reset your priorities.`
  }
  return `Reversed, ${card.value.name} suggests the shadow side of ${k}. It can indicate delay, inner resistance, or a lesson that needs gentleness before it moves forward.`
})

const reflection = computed(() => {
  return [
    `Where is ${card.value.name} showing up in my life right now?`,
    'What feels aligned — and what feels forced?',
    'What is the smallest next step I can take today?',
  ]
})

const related = computed(() => {
  const pool = allCards.filter(c => c.slug !== card.value.slug)
  const seed = card.value.slug.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const start = pool.length ? (seed % pool.length) : 0
  return [...pool.slice(start), ...pool.slice(0, start)].slice(0, 6)
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
  const title = `${card.value.name} Meaning (Upright & Reversed) | StarLoom`
  const description = `Learn the ${card.value.name} tarot meaning: keywords, upright and reversed interpretations, and quick reflection prompts. Free tarot guide for beginners.`
  const extraKeywords = minorMeta.value
    ? `${minorMeta.value.rankKeywords.join(', ')}, ${minorMeta.value.suitKeywords.join(', ')}`
    : ''
  setSEO('home', {
    title,
    description,
    keywords: `${card.value.name} meaning, ${card.value.name} tarot, tarot card meanings, upright meaning, reversed meaning${extraKeywords ? `, ${extraKeywords}` : ''}`
  })
  setCanonical(route.path)
  setHreflang({ en: `https://ibazi.site${route.path}` })
  setBreadcrumb([
    { name: 'Home', url: 'https://ibazi.site/en' },
    { name: 'Tarot Cards', url: 'https://ibazi.site/en/tarot/cards' },
    { name: `${card.value.name} Meaning`, url: `https://ibazi.site${route.path}` }
  ])
  setStructuredData('faq', {
    questions: [
      {
        question: `What does ${card.value.name} mean in tarot?`,
        answer: uprightText.value,
      },
      {
        question: `What does ${card.value.name} mean reversed?`,
        answer: reversedText.value,
      },
      {
        question: `How should I use ${card.value.name} in a reading?`,
        answer: 'Use the keywords as a theme, then connect it to the question and the card position. Look for one practical next step and one inner lesson.',
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
  margin-bottom: 14px;

  h1 {
    margin: 0 0 8px;
    font-size: 1.7rem;
  }

  .subtitle {
    margin: 0;
    color: $text-secondary;
  }

  .kw {
    color: $primary-gold;
  }
}

.content {
  margin-top: 16px;
  background: $bg-secondary;
  border: 1px solid rgba($primary-gold, 0.12);
  border-radius: 18px;
  padding: 16px;
}

.panel {
  background: $bg-primary;
  border: 1px solid rgba($primary-gold, 0.1);
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;

  h2 {
    margin: 0 0 8px;
    font-size: 1rem;
  }

  p,
  li {
    color: $text-secondary;
    line-height: 1.7;
  }

  ul {
    margin: 0;
    padding-left: 18px;
  }
}

.cta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 6px;
}

.btn {
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  background: $gradient-purple-gold;
  color: $text-primary;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.btn.secondary {
  background: rgba($primary-gold, 0.12);
  border: 1px solid rgba($primary-gold, 0.2);
}

.related {
  margin-top: 18px;

  h2 {
    margin: 0 0 10px;
    font-size: 1.1rem;
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
  }

  .meta {
    color: $text-secondary;
    font-size: 0.9rem;
  }
}

@media (min-width: 720px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
