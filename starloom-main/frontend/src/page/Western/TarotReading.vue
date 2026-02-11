<template>
  <div class="tarot-reading">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1>{{ $t('tarot_title') }}</h1>
        <p>{{ $t('tarot_subtitle') }}</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="tarot-content">
      <div class="container">
        <div class="tarot-layout">
          <!-- Spread Selection -->
          <div class="spread-selector">
            <h2>{{ $t('tarot_select_spread') }}</h2>
            <div class="spread-options">
              <button
                v-for="spread in spreads"
                :key="spread.id"
                class="spread-btn"
                :class="{ active: selectedSpread === spread.id }"
                @click="selectSpread(spread.id)"
              >
                <div class="spread-name">{{ spread.name }}</div>
                <div class="spread-desc">{{ spread.description }}</div>
              </button>
            </div>
          </div>

          <!-- Draw Button -->
          <div class="draw-section">
            <div v-if="isRitualing" class="ritual-hint">Shuffling the deck… Focus your intention.</div>
            <button
              class="btn btn-primary draw-btn"
              @click="drawCard"
              :disabled="isLoading || isRitualing"
            >
              <span v-if="!isLoading && !isRitualing">{{ $t('tarot_draw_card') }}</span>
              <span v-else>{{ $t('loading') }}</span>
            </button>
          </div>

          <!-- Card Display -->
          <div v-if="currentReading" class="card-display">
            <h2>{{ $t('tarot_interpretation') }}</h2>
            <div class="cards-container" :class="{ 'celtic-mobile': isCelticCross }">
              <div
                v-for="(card, index) in currentReading.cards"
                :key="index"
                class="card-wrapper"
              >
                <div class="tarot-card" :class="{ flipped: flippedCards[index], reversed: card.reversed }">
                  <div class="tarot-card-inner">
                    <div class="tarot-card-face tarot-card-back">
                      <div class="back-mark">✦</div>
                      <div class="back-title">StarLoom</div>
                    </div>
                    <div class="tarot-card-face tarot-card-front">
                      <div class="card-content">
                        <div class="card-icon">🃏</div>
                        <div class="card-name">{{ card.name }}</div>
                        <div class="card-position">{{ card.position }}</div>
                        <div v-if="card.reversed" class="reversed-label">
                          {{ $t('tarot_reversed') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interpretation Text -->
            <div class="interpretation">
              <p>{{ currentReading.interpretation }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn btn-secondary" @click="copyReading">
                Copy
              </button>
              <button class="btn btn-secondary" @click="saveReading">
                {{ $t('tarot_save_reading') }}
              </button>
              <button class="btn btn-secondary" @click="shareReading">
                {{ $t('tarot_share_reading') }}
              </button>
            </div>
          </div>

          <!-- Reading History -->
          <div class="reading-history">
            <h2>{{ $t('tarot_reading_history') }}</h2>
            <div v-if="tarotHistory.length > 0" class="history-list">
              <div
                v-for="(reading, index) in tarotHistory.slice(0, 5)"
                :key="index"
                class="history-item"
              >
                <div class="history-date">
                  {{ formatDate(reading.timestamp) }}
                </div>
                <div class="history-cards">
                  <span v-for="card in reading.cards" :key="card.id">
                    {{ card.name }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="no-history">
              {{ $t('tarot_no_history') }}
            </div>
            <button
              v-if="tarotHistory.length > 0"
              class="btn btn-text"
              @click="clearHistory"
            >
              {{ $t('tarot_clear_history') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { setSEO, setCanonical, setBreadcrumb, setStructuredData, setHreflang } from '../../utils/seo'

export default {
  name: 'TarotReading',
  data() {
    return {
      isRitualing: false,
      flippedCards: [],
      spreads: [
        {
          id: 'single-card',
          name: this.$t('tarot_single_card'),
          description: this.$t('tarot_single_card_desc')
        },
        {
          id: 'three-card',
          name: this.$t('tarot_three_card'),
          description: this.$t('tarot_three_card_desc')
        },
        {
          id: 'celtic-cross',
          name: this.$t('tarot_celtic_cross'),
          description: this.$t('tarot_celtic_cross_desc')
        }
      ]
    }
  },
  computed: {
    ...mapState('western', [
      'currentTarotReading',
      'tarotHistory',
      'selectedTarotSpread',
      'isLoading'
    ]),
    currentReading() {
      return this.currentTarotReading
    },
    selectedSpread() {
      return this.selectedTarotSpread
    },
    isCelticCross() {
      return this.selectedTarotSpread === 'celtic-cross'
    }
  },
  watch: {
    currentReading: {
      handler(newVal) {
        if (!newVal || !newVal.cards) {
          this.flippedCards = []
          return
        }
        this.flippedCards = new Array(newVal.cards.length).fill(false)
        // stagger flip for better feedback
        newVal.cards.forEach((_, idx) => {
          setTimeout(() => {
            if (this.flippedCards[idx] === undefined) return
            this.$set
              ? this.$set(this.flippedCards, idx, true)
              : (this.flippedCards.splice(idx, 1, true))
          }, 260 + idx * 140)
        })
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('western', [
      'drawTarotCard',
      'clearTarotHistory',
      'setSelectedTarotSpread'
    ]),
    selectSpread(spreadId) {
      this.setSelectedTarotSpread(spreadId)
    },
    async drawCard() {
      if (this.isLoading || this.isRitualing) return
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      try {
        this.isRitualing = true
        this.flippedCards = []

        // light haptic feedback on supported mobile devices
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([18, 40, 18])
        }

        // short ritual delay (shuffle)
        await sleep(650)
        await this.drawTarotCard({ spread: this.selectedSpread })
      } catch (error) {
        console.error('Failed to draw card:', error)
      } finally {
        this.isRitualing = false
      }
    },
    saveReading() {
      // 保存阅读到本地存储
      const reading = this.currentTarotReading
      const saved = JSON.parse(localStorage.getItem('saved_tarot_readings') || '[]')
      saved.push({
        ...reading,
        savedAt: new Date().toISOString()
      })
      localStorage.setItem('saved_tarot_readings', JSON.stringify(saved))
      alert('Reading saved successfully!')
    },
    shareReading() {
      // 分享阅读
      const text = `I just got a tarot reading on StarLoom! ${this.currentReading.cards.map(c => c.name).join(', ')}`
      if (navigator.share) {
        navigator.share({
          title: 'My Tarot Reading',
          text: text
        })
      } else {
        alert('Share: ' + text)
      }
    },
    async copyReading() {
      if (!this.currentReading) return
      const cardsText = this.currentReading.cards
        .map(c => {
          const rev = c.reversed ? ' (reversed)' : ''
          return `- ${c.position}: ${c.name}${rev}`
        })
        .join('\n')

      const text = `${this.currentReading.spreadId}\n\nCards:\n${cardsText}\n\nInterpretation:\n${this.currentReading.interpretation}`

      try {
        await navigator.clipboard.writeText(text)
        alert('Copied!')
      } catch (e) {
        const el = document.createElement('textarea')
        el.value = text
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        alert('Copied!')
      }
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString()
    },
    async clearHistory() {
      if (confirm('Are you sure you want to clear all history?')) {
        this.clearTarotHistory()
      }
    }
  },
  mounted() {
    setSEO('home', {
      title: 'Free Tarot Reading (1, 3, 10 Cards) | StarLoom',
      description: 'Get a free tarot reading with 1-card, 3-card, or Celtic Cross spreads. Draw cards, read a quick interpretation, and copy/share your result — mobile-friendly.',
      keywords: 'free tarot reading, tarot reading online, draw tarot cards, celtic cross, three card spread'
    })
    setCanonical(this.$route.path)
    setHreflang({ en: `https://ibazi.site${this.$route.path}` })
    setBreadcrumb([
      { name: 'Home', url: 'https://ibazi.site/en' },
      { name: 'Tarot', url: 'https://ibazi.site/en/tarot' }
    ])
    setStructuredData('faq', {
      questions: [
        {
          question: 'Is this tarot reading free?',
          answer: 'Yes. This tarot tool is free to use and generates a quick reading for reflection and entertainment.',
        },
        {
          question: 'What tarot spreads can I use?',
          answer: 'You can draw a single card, a three-card past/present/future spread, or a 10-card Celtic Cross spread.',
        },
        {
          question: 'What does reversed mean?',
          answer: 'A reversed card can suggest blocked energy, a lesson to integrate, or an internal version of the theme — interpret it in context of your question and position.',
        },
      ],
    })
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.tarot-reading {
  width: 100%;
  background-color: $bg-primary;
  color: $text-primary;
}

// Page Header
.page-header {
  padding: 40px 0;
  background: $gradient-purple-gold;
  text-align: center;

  h1 {
    font-size: 1.5rem;
    margin-bottom: 12px;
    color: $text-primary;
  }

  p {
    font-size: 0.9rem;
    color: $text-secondary;
  }
}

// Tarot Content
.tarot-content {
  padding: 40px 0;
}

.tarot-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

// Spread Selector
.spread-selector {
  h2 {
    margin-bottom: 20px;
    font-size: 1.2rem;
  }

  .spread-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .spread-btn {
    padding: 16px;
    background-color: $bg-secondary;
    border: 2px solid rgba($primary-gold, 0.2);
    border-radius: $radius-xl;
    cursor: pointer;
    transition: all $transition-base;
    text-align: center;

    &:hover {
      border-color: $primary-gold;
      box-shadow: $shadow-lg;
    }

    &.active {
      background: $gradient-purple-gold;
      border-color: $primary-gold;
      color: $text-primary;
    }

    .spread-name {
      font-weight: $font-weight-bold;
      font-size: 0.9rem;
      margin-bottom: 6px;
    }

    .spread-desc {
      font-size: 0.75rem;
      color: $text-tertiary;
    }
  }
}

// Draw Section
.draw-section {
  text-align: center;
  padding: 18px;
  background: linear-gradient(180deg, rgba($primary-gold, 0.06) 0%, rgba($primary-purple, 0.08) 100%);
  border-radius: $radius-2xl;
  border: 1px solid rgba($primary-gold, 0.18);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -60px;
    background: radial-gradient(circle at 30% 35%, rgba($primary-gold, 0.22), transparent 45%),
      radial-gradient(circle at 70% 70%, rgba($primary-purple, 0.25), transparent 55%);
    opacity: 0.55;
    filter: blur(2px);
    animation: ritual-breathe 3.2s ease-in-out infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, transparent 0%, rgba($primary-gold, 0.18) 35%, transparent 70%);
    transform: translateX(-120%);
    animation: ritual-shimmer 5s ease-in-out infinite;
    pointer-events: none;
  }

  .ritual-hint {
    position: relative;
    z-index: 2;
    margin-bottom: 10px;
    font-size: 0.9rem;
    color: $text-secondary;
  }

  .draw-btn {
    padding: 12px 44px;
    font-size: 1rem;
    border-radius: 999px;
    border: 1px solid rgba($primary-gold, 0.35);
    background: $gradient-purple-gold;
    color: $text-primary;
    font-weight: $font-weight-bold;
    letter-spacing: 0.2px;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35), 0 0 26px rgba($primary-gold, 0.15);
    transition: transform $transition-base, box-shadow $transition-base, filter $transition-base;

    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.06);
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45), 0 0 34px rgba($primary-gold, 0.22);
    }

    &:active {
      transform: translateY(0px) scale(0.99);
    }
  }
}

@keyframes ritual-breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.75;
  }
}

@keyframes ritual-shimmer {
  0% {
    transform: translateX(-120%);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  40% {
    transform: translateX(120%);
    opacity: 0;
  }
  100% {
    transform: translateX(120%);
    opacity: 0;
  }
}

// Card Display
.card-display {
  h2 {
    margin-bottom: 20px;
    font-size: 1.2rem;
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 30px;
    margin-bottom: 40px;

    .card-wrapper {
      display: flex;
      justify-content: center;
    }

    .tarot-card {
      width: 150px;
      height: 250px;
      border-radius: $radius-xl;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: $shadow-lg;
      transition: all $transition-base;
      cursor: pointer;
      transform: translateY(0);
      perspective: 1000px;
      background: transparent;
      border: 1px solid rgba($primary-gold, 0.25);
      overflow: hidden;

      &:hover {
        transform: translateY(-8px);
        box-shadow: $shadow-xl;
      }

      &.reversed {
        transform: rotateZ(180deg) translateY(0);
      }

      &.reversed:hover {
        transform: rotateZ(180deg) translateY(8px);
      }

      &.flipped .tarot-card-inner {
        transform: rotateY(180deg);
      }

      .tarot-card-inner {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      }

      .tarot-card-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        border-radius: $radius-xl;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }

      .tarot-card-back {
        background: radial-gradient(circle at 30% 20%, rgba($primary-gold, 0.18), transparent 45%),
          radial-gradient(circle at 70% 80%, rgba($primary-purple, 0.22), transparent 55%),
          rgba($bg-secondary, 0.95);
        border: 1px solid rgba($primary-gold, 0.25);

        .back-mark {
          width: 62px;
          height: 62px;
          border-radius: 999px;
          border: 1px solid rgba($primary-gold, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba($primary-gold, 0.85);
          font-size: 1.4rem;
          box-shadow: 0 0 22px rgba($primary-gold, 0.15);
        }

        .back-title {
          position: absolute;
          bottom: 14px;
          left: 0;
          right: 0;
          text-align: center;
          color: rgba($text-primary, 0.75);
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
      }

      .tarot-card-front {
        background: $gradient-purple-gold;
        transform: rotateY(180deg);
      }

      .card-content {
        text-align: center;
        color: $text-primary;
      }

      &.reversed .card-content {
        transform: rotateZ(180deg);
      }

      .card-icon {
        font-size: 3rem;
        margin-bottom: 8px;
      }

      .card-name {
        font-weight: $font-weight-bold;
        font-size: 0.875rem;
        margin-bottom: 4px;
      }

      .card-position {
        font-size: 0.75rem;
        opacity: 0.8;
        margin-bottom: 4px;
      }

      .reversed-label {
        font-size: 0.7rem;
        color: $warning-color;
        font-weight: $font-weight-bold;
      }
    }
  }

  .interpretation {
    background-color: $bg-secondary;
    padding: 30px;
    border-radius: $radius-xl;
    border-left: 4px solid $primary-gold;
    margin-bottom: 30px;
    min-height: 120px;

    p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.8;
      color: rgba($text-primary, 0.88);
    }
  }

  .action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;

    .btn {
      padding: 12px 32px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba($primary-gold, 0.28);
      color: $text-primary;
      border-radius: 999px;
      transition: transform $transition-base, box-shadow $transition-base, filter $transition-base;

      &:hover {
        filter: brightness(1.05);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.25);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0px) scale(0.99);
      }
    }
  }
}

// Reading History
.reading-history {
  background-color: $bg-secondary;
  padding: 30px;
  border-radius: $radius-xl;
  border: 1px solid rgba($primary-gold, 0.1);

  h2 {
    margin-bottom: 20px;
    font-size: 1.25rem;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;

    .history-item {
      padding: 16px;
      background-color: $bg-primary;
      border-radius: $radius-lg;
      border-left: 3px solid $primary-gold;

      .history-date {
        font-size: 0.875rem;
        color: $text-tertiary;
        margin-bottom: 8px;
      }

      .history-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        span {
          display: inline-block;
          padding: 4px 12px;
          background-color: rgba($primary-gold, 0.1);
          border-radius: $radius-md;
          font-size: 0.8rem;
          color: $primary-gold;
        }
      }
    }
  }

  .no-history {
    text-align: center;
    padding: 20px;
    color: $text-tertiary;
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .spread-selector .spread-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-display .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 22px 0;

    h1 {
      font-size: 1.6rem;
      line-height: 1.2;
    }

    p {
      font-size: 0.95rem;
      line-height: 1.5;
      max-width: 320px;
      margin: 0 auto;
    }
  }

  .tarot-content {
    padding: 18px 0;
  }

  .tarot-layout {
    gap: 22px;
  }

  .spread-selector {
    h2 {
      font-size: 1.05rem;
      margin-bottom: 12px;
    }
  }

  .spread-selector .spread-options {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .spread-selector .spread-btn {
    padding: 14px;
  }

  .card-display .cards-container {
    grid-template-columns: 1fr;
  }

  .card-display .cards-container.celtic-mobile {
    display: flex;
    overflow-x: auto;
    padding-bottom: 10px;
    gap: 12px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .card-display .cards-container.celtic-mobile .card-wrapper {
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  .card-display .cards-container.celtic-mobile .tarot-card {
    width: 140px;
    height: 232px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
}

@media (max-width: 640px) {
  .page-header {
    padding: 18px 0;

    h1 {
      font-size: 1.4rem;
    }

    p {
      font-size: 0.9rem;
    }
  }

  .tarot-content {
    padding: 14px 0;
  }

  .tarot-layout {
    gap: 22px;
  }

  .spread-btn {
    padding: 16px;

    .spread-name {
      font-size: 1rem;
    }

    .spread-desc {
      font-size: 0.75rem;
    }
  }

  .draw-section {
    padding: 24px;

    .draw-btn {
      padding: 16px 32px;
      font-size: 1rem;
    }
  }

  .card-display {
    .cards-container {
      gap: 20px;

      .tarot-card {
        width: 120px;
        height: 200px;
      }
    }

    .cards-container.celtic-mobile {
      gap: 10px;
    }

    .cards-container.celtic-mobile .tarot-card {
      width: 132px;
      height: 220px;
    }

    .interpretation {
      padding: 20px;
    }
  }
}
</style>
