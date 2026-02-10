<template>
  <div class="daily-horoscope">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1>{{ $t('horoscope_title') }}</h1>
        <p>{{ $t('horoscope_subtitle') }}</p>
      </div>
    </section>

    <!-- Horoscope Content -->
    <section class="horoscope-content">
      <div class="container">
        <!-- Zodiac Signs Grid -->
        <div class="horoscope-grid">
          <div
            v-for="sign in zodiacSigns"
            :key="sign"
            class="horoscope-card"
            @click="selectZodiac(sign)"
            :class="{ active: selectedZodiac === sign }"
          >
            <div class="sign-icon">{{ getZodiacIcon(sign) }}</div>
            <h3>{{ sign }}</h3>
            <p class="sign-dates">{{ getZodiacDates(sign) }}</p>
          </div>
        </div>

        <!-- Selected Zodiac Details -->
        <div v-if="selectedZodiac && currentHoroscope" class="horoscope-details">
          <div class="details-header">
            <h2>{{ selectedZodiac }} - {{ getCurrentDate() }}</h2>
          </div>

          <!-- Daily Reading -->
          <div class="reading-section">
            <h3>{{ $t('horoscope_daily_reading') }}</h3>
            <p class="reading-text">{{ currentHoroscope.dailyReading }}</p>
          </div>

          <!-- Life Areas -->
          <div class="life-areas">
            <div class="area-card">
              <h4>{{ $t('horoscope_love') }}</h4>
              <p>{{ currentHoroscope.love }}</p>
            </div>

            <div class="area-card">
              <h4>{{ $t('horoscope_career') }}</h4>
              <p>{{ currentHoroscope.career }}</p>
            </div>

            <div class="area-card">
              <h4>{{ $t('horoscope_health') }}</h4>
              <p>{{ currentHoroscope.health }}</p>
            </div>
          </div>

          <!-- Lucky Elements -->
          <div class="lucky-elements">
            <div class="lucky-item">
              <span class="label">{{ $t('horoscope_lucky_number') }}</span>
              <span class="value">{{ currentHoroscope.luckyNumber }}</span>
            </div>

            <div class="lucky-item">
              <span class="label">{{ $t('horoscope_lucky_color') }}</span>
              <span class="value" :style="{ color: getLuckyColorValue(currentHoroscope.luckyColor) }">
                {{ currentHoroscope.luckyColor }}
              </span>
            </div>

            <div class="lucky-item">
              <span class="label">{{ $t('horoscope_lucky_time') }}</span>
              <span class="value">{{ currentHoroscope.luckyTime }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="saveHoroscope">
              Save Horoscope
            </button>
            <button class="btn btn-secondary" @click="shareHoroscope">
              Share
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
  name: 'DailyHoroscope',
  data() {
    return {
      zodiacSigns: [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
      ],
      zodiacIcons: {
        'Aries': '♈',
        'Taurus': '♉',
        'Gemini': '♊',
        'Cancer': '♋',
        'Leo': '♌',
        'Virgo': '♍',
        'Libra': '♎',
        'Scorpio': '♏',
        'Sagittarius': '♐',
        'Capricorn': '♑',
        'Aquarius': '♒',
        'Pisces': '♓'
      },
      zodiacDates: {
        'Aries': 'Mar 21 - Apr 19',
        'Taurus': 'Apr 20 - May 20',
        'Gemini': 'May 21 - Jun 20',
        'Cancer': 'Jun 21 - Jul 22',
        'Leo': 'Jul 23 - Aug 22',
        'Virgo': 'Aug 23 - Sep 22',
        'Libra': 'Sep 23 - Oct 22',
        'Scorpio': 'Oct 23 - Nov 21',
        'Sagittarius': 'Nov 22 - Dec 21',
        'Capricorn': 'Dec 22 - Jan 19',
        'Aquarius': 'Jan 20 - Feb 18',
        'Pisces': 'Feb 19 - Mar 20'
      },
      horoscopes: [
        {
          zodiacSign: 'Aries',
          dailyReading: 'Today brings new opportunities for growth and adventure. Your energy is high, and people are drawn to your enthusiasm. Take advantage of this positive momentum to pursue your goals.',
          love: 'Romance is in the air. If you\'re single, you might meet someone interesting. If you\'re in a relationship, this is a great day to reconnect with your partner.',
          career: 'Focus on your professional goals. Your hard work will be noticed, and you might receive recognition or a new opportunity.',
          health: 'Take care of yourself. Exercise and eat well to maintain your energy levels.',
          luckyNumber: 7,
          luckyColor: 'Red',
          luckyTime: '3 PM'
        },
        {
          zodiacSign: 'Taurus',
          dailyReading: 'Stability and security are your focus today. This is a good time to make practical decisions and plan for the future.',
          love: 'Your loyalty and dependability are attractive qualities. Show your loved ones how much they mean to you.',
          career: 'Steady progress is the theme. Keep working on your projects with patience and determination.',
          health: 'Balance is key. Make sure to rest and relax as much as you work.',
          luckyNumber: 4,
          luckyColor: 'Green',
          luckyTime: '10 AM'
        }
      ]
    }
  },
  computed: {
    ...mapState('western', ['selectedZodiac']),
    currentHoroscope() {
      return this.horoscopes.find(h => h.zodiacSign === this.selectedZodiac)
    }
  },
  methods: {
    ...mapActions('western', ['setSelectedZodiac']),
    selectZodiac(sign) {
      this.setSelectedZodiac(sign)
    },
    getZodiacIcon(sign) {
      return this.zodiacIcons[sign] || '♈'
    },
    getZodiacDates(sign) {
      return this.zodiacDates[sign] || ''
    },
    getCurrentDate() {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getLuckyColorValue(colorName) {
      const colorMap = {
        'Red': '#EF4444',
        'Green': '#10B981',
        'Blue': '#3B82F6',
        'Yellow': '#FBBF24',
        'Purple': '#8B5CF6',
        'Pink': '#EC4899'
      }
      return colorMap[colorName] || '#F59E0B'
    },
    saveHoroscope() {
      const saved = JSON.parse(localStorage.getItem('saved_horoscopes') || '[]')
      saved.push({
        ...this.currentHoroscope,
        savedAt: new Date().toISOString()
      })
      localStorage.setItem('saved_horoscopes', JSON.stringify(saved))
      alert('Horoscope saved successfully!')
    },
    shareHoroscope() {
      const text = `My ${this.selectedZodiac} horoscope for today: ${this.currentHoroscope.dailyReading}`
      if (navigator.share) {
        navigator.share({
          title: `${this.selectedZodiac} Horoscope`,
          text: text
        })
      } else {
        alert('Share: ' + text)
      }
    }
  },
  mounted() {
    document.title = this.$t('seo_horoscope_title')
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', this.$t('seo_horoscope_desc'))
    }
    // 默认选择第一个星座
    if (!this.selectedZodiac) {
      this.selectZodiac('Aries')
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.daily-horoscope {
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

// Horoscope Content
.horoscope-content {
  padding: 40px 0;
}

// Horoscope Grid
.horoscope-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 40px;

  .horoscope-card {
    background-color: $bg-secondary;
    padding: 16px;
    border-radius: $radius-xl;
    border: 2px solid rgba($primary-gold, 0.2);
    text-align: center;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      border-color: $primary-gold;
      box-shadow: $shadow-lg;
      transform: translateY(-5px);
    }

    &.active {
      background: $gradient-purple-gold;
      border-color: $primary-gold;
    }

    .sign-icon {
      font-size: 1.5rem;
      margin-bottom: 6px;
    }

    h3 {
      font-size: 0.85rem;
      margin-bottom: 3px;
    }

    .sign-dates {
      font-size: 0.65rem;
      color: $text-tertiary;
      margin: 0;
    }
  }
}

// Horoscope Details
.horoscope-details {
  background-color: $bg-secondary;
  padding: 24px;
  border-radius: $radius-2xl;
  border: 1px solid rgba($primary-gold, 0.1);

  .details-header {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid rgba($primary-gold, 0.2);

    h2 {
      margin: 0;
      font-size: 1.3rem;
      color: $primary-gold;
    }
  }

  .reading-section {
    margin-bottom: 20px;

    h3 {
      font-size: 1rem;
      margin-bottom: 12px;
    }

    .reading-text {
      font-size: 0.9rem;
      line-height: 1.6;
      color: $text-secondary;
    }
  }

  // Life Areas
  .life-areas {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;

    .area-card {
      background-color: $bg-primary;
      padding: 16px;
      border-radius: $radius-lg;
      border-left: 4px solid $primary-gold;

      h4 {
        font-size: 0.95rem;
        margin-bottom: 12px;
        color: $primary-gold;
      }

      p {
        font-size: 0.875rem;
        line-height: 1.6;
        color: $text-secondary;
        margin: 0;
      }
    }
  }

  // Lucky Elements
  .lucky-elements {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    background-color: $bg-primary;
    border-radius: $radius-lg;

    .lucky-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .label {
        font-size: 0.75rem;
        color: $text-tertiary;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .value {
        font-size: 1.5rem;
        font-weight: $font-weight-bold;
        color: $primary-gold;
      }
    }
  }

  // Action Buttons
  .action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;

    .btn {
      padding: 12px 32px;
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .horoscope-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .life-areas {
    grid-template-columns: 1fr;
  }

  .lucky-elements {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;

    h1 {
      font-size: 1.875rem;
    }
  }

  .horoscope-content {
    padding: 40px 0;
  }

  .horoscope-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 40px;

    .horoscope-card {
      padding: 16px;

      .sign-icon {
        font-size: 1.5rem;
      }

      h3 {
        font-size: 0.85rem;
      }

      .sign-dates {
        font-size: 0.65rem;
      }
    }
  }

  .horoscope-details {
    padding: 24px;

    .details-header h2 {
      font-size: 1.25rem;
    }

    .reading-section h3 {
      font-size: 1rem;
    }

    .area-card h4 {
      font-size: 0.875rem;
    }
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

  .horoscope-content {
    padding: 30px 0;
  }

  .horoscope-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .horoscope-card {
      padding: 12px;

      .sign-icon {
        font-size: 1.25rem;
      }

      h3 {
        font-size: 0.75rem;
      }

      .sign-dates {
        font-size: 0.6rem;
      }
    }
  }

  .horoscope-details {
    padding: 20px;

    .details-header h2 {
      font-size: 1.125rem;
    }

    .reading-text {
      font-size: 0.875rem;
    }

    .life-areas {
      gap: 16px;

      .area-card {
        padding: 16px;

        h4 {
          font-size: 0.8rem;
        }

        p {
          font-size: 0.75rem;
        }
      }
    }

    .lucky-elements {
      padding: 16px;
      gap: 16px;

      .lucky-item {
        .label {
          font-size: 0.7rem;
        }

        .value {
          font-size: 1.25rem;
        }
      }
    }

    .action-buttons {
      flex-direction: column;

      .btn {
        width: 100%;
      }
    }
  }
}
</style>
