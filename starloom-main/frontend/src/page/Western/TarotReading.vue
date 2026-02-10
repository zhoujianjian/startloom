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
            <button
              class="btn btn-primary draw-btn"
              @click="drawCard"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">{{ $t('tarot_draw_card') }}</span>
              <span v-else>{{ $t('loading') }}</span>
            </button>
          </div>

          <!-- Card Display -->
          <div v-if="currentReading" class="card-display">
            <h2>{{ $t('tarot_interpretation') }}</h2>
            <div class="cards-container">
              <div
                v-for="(card, index) in currentReading.cards"
                :key="index"
                class="card-wrapper"
              >
                <div class="tarot-card" :class="{ reversed: card.reversed }">
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

            <!-- Interpretation Text -->
            <div class="interpretation">
              <p>{{ currentReading.interpretation }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
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

export default {
  name: 'TarotReading',
  data() {
    return {
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
    selectedSpread() {
      return this.selectedTarotSpread
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
      try {
        await this.drawTarotCard({ spread: this.selectedSpread })
      } catch (error) {
        console.error('Failed to draw card:', error)
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
    document.title = this.$t('seo_tarot_title')
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', this.$t('seo_tarot_desc'))
    }
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
  padding: 30px;
  background-color: $bg-secondary;
  border-radius: $radius-2xl;
  border: 2px solid rgba($primary-gold, 0.1);

  .draw-btn {
    padding: 12px 36px;
    font-size: 1rem;
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
      background: $gradient-purple-gold;
      border-radius: $radius-xl;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: $shadow-lg;
      transition: all $transition-base;
      cursor: pointer;

      &:hover {
        transform: translateY(-10px);
        box-shadow: $shadow-xl;
      }

      &.reversed {
        transform: rotateZ(180deg);
      }

      .card-content {
        text-align: center;
        color: $text-primary;
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

    p {
      margin: 0;
      line-height: 1.8;
      color: $text-secondary;
    }
  }

  .action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;

    .btn {
      padding: 12px 32px;
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
    padding: 40px 0;

    h1 {
      font-size: 1.875rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .tarot-content {
    padding: 40px 0;
  }

  .spread-selector .spread-options {
    grid-template-columns: 1fr;
  }

  .card-display .cards-container {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .page-header {
    padding: 30px 0;

    h1 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.875rem;
    }
  }

  .tarot-content {
    padding: 30px 0;
  }

  .tarot-layout {
    gap: 40px;
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

    .interpretation {
      padding: 20px;
    }
  }
}
</style>
