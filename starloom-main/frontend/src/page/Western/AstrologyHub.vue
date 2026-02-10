<template>
  <div class="astrology-hub">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1>{{ $t('astrology_title') }}</h1>
        <p>{{ $t('astrology_subtitle') }}</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="astrology-content">
      <div class="container">
        <!-- Birth Chart Section -->
        <div class="birth-chart-section">
          <h2>{{ $t('astrology_birth_chart') }}</h2>
          
          <div class="birth-form">
            <h3>{{ $t('astrology_enter_birth_info') }}</h3>
            <form @submit.prevent="generateChart">
              <div class="form-group">
                <label>{{ $t('astrology_birth_date') }}</label>
                <input
                  v-model="birthDate"
                  type="date"
                  required
                />
              </div>

              <div class="form-group">
                <label>{{ $t('astrology_birth_time') }}</label>
                <input
                  v-model="birthTime"
                  type="time"
                />
              </div>

              <div class="form-group">
                <label>{{ $t('astrology_birth_location') }}</label>
                <input
                  v-model="birthLocation"
                  type="text"
                  placeholder="City, Country"
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">{{ $t('astrology_generate_chart') }}</span>
                <span v-else>{{ $t('loading') }}</span>
              </button>
            </form>
          </div>

          <!-- Birth Chart Display -->
          <div v-if="birthChart" class="chart-display">
            <div class="chart-grid">
              <div class="chart-card">
                <h4>{{ $t('astrology_sun_sign') }}</h4>
                <div class="sign-value">{{ birthChart.sunSign }}</div>
              </div>
              <div class="chart-card">
                <h4>{{ $t('astrology_moon_sign') }}</h4>
                <div class="sign-value">{{ birthChart.moonSign }}</div>
              </div>
              <div class="chart-card">
                <h4>{{ $t('astrology_rising_sign') }}</h4>
                <div class="sign-value">{{ birthChart.risingSign }}</div>
              </div>
            </div>

            <!-- Astrology Wheel -->
            <div class="astrology-wheel">
              <div class="wheel-placeholder">
                <div class="wheel-icon">♈</div>
                <p>Astrology Wheel Visualization</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Planets Section -->
        <div class="planets-section">
          <h2>{{ $t('astrology_planets') }}</h2>
          <div class="planets-grid">
            <div
              v-for="planet in planets"
              :key="planet.name"
              class="planet-card"
            >
              <div class="planet-icon">🌙</div>
              <h4>{{ planet.name }}</h4>
              <p class="planet-sign">{{ planet.sign }}</p>
              <p class="planet-degree">{{ planet.degree }}°</p>
            </div>
          </div>
        </div>

        <!-- Moon Phase Section -->
        <div class="moon-phase-section">
          <h2>{{ $t('astrology_moon_phase') }}</h2>
          <div class="moon-phase-card">
            <div class="moon-icon">🌙</div>
            <div class="moon-info">
              <p class="phase-name">Waxing Gibbous</p>
              <p class="phase-illumination">Illumination: 75%</p>
            </div>
          </div>
        </div>

        <!-- Retrograde Alerts -->
        <div class="retrograde-section">
          <h2>{{ $t('astrology_retrograde_alerts') }}</h2>
          <div class="retrograde-list">
            <div class="retrograde-item">
              <div class="retrograde-icon">⚠️</div>
              <div class="retrograde-info">
                <h4>Mercury Retrograde</h4>
                <p>Feb 15 - Mar 10, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AstrologyHub',
  data() {
    return {
      birthDate: '',
      birthTime: '',
      birthLocation: '',
      planets: [
        { name: 'Sun', sign: 'Capricorn', degree: 25.5 },
        { name: 'Moon', sign: 'Pisces', degree: 12.3 },
        { name: 'Mercury', sign: 'Aquarius', degree: 8.7 },
        { name: 'Venus', sign: 'Sagittarius', degree: 18.2 },
        { name: 'Mars', sign: 'Scorpio', degree: 5.1 },
        { name: 'Jupiter', sign: 'Gemini', degree: 22.4 },
        { name: 'Saturn', sign: 'Pisces', degree: 15.8 },
        { name: 'Uranus', sign: 'Taurus', degree: 19.3 }
      ]
    }
  },
  computed: {
    ...mapState('western', ['birthChart', 'isLoading'])
  },
  methods: {
    ...mapActions('western', ['fetchBirthChart']),
    async generateChart() {
      try {
        await this.fetchBirthChart({
          birthDate: this.birthDate,
          birthTime: this.birthTime,
          birthLocation: this.birthLocation
        })
      } catch (error) {
        console.error('Failed to generate chart:', error)
      }
    }
  },
  mounted() {
    document.title = this.$t('seo_astrology_title')
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', this.$t('seo_astrology_desc'))
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.astrology-hub {
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

// Astrology Content
.astrology-content {
  padding: 40px 0;

  h2 {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
}

// Birth Chart Section
.birth-chart-section {
  margin-bottom: 40px;

  .birth-form {
    background-color: $bg-secondary;
    padding: 24px;
    border-radius: $radius-2xl;
    border: 1px solid rgba($primary-gold, 0.1);
    margin-bottom: 24px;

    h3 {
      font-size: 1rem;
      margin-bottom: 16px;
    }

    form {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-weight: $font-weight-medium;
          font-size: 0.8rem;
          color: $text-secondary;
        }

        input {
          padding: 10px;
          background-color: $bg-primary;
          border: 2px solid rgba($primary-gold, 0.2);
          border-radius: $radius-lg;
          color: $text-primary;
          font-size: 0.8rem;

          &:focus {
            outline: none;
            border-color: $primary-gold;
            box-shadow: 0 0 0 3px rgba($primary-gold, 0.1);
          }
        }
      }

      .btn {
        grid-column: 1 / -1;
        padding: 10px 24px;
        font-size: 0.9rem;
      }
    }
  }

  .chart-display {
    .chart-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      .chart-card {
        background-color: $bg-secondary;
        padding: 20px;
        border-radius: $radius-xl;
        border: 2px solid rgba($primary-gold, 0.2);
        text-align: center;
        transition: all $transition-base;

        &:hover {
          border-color: $primary-gold;
          box-shadow: $shadow-lg;
        }

        h4 {
          font-size: 0.75rem;
          color: $text-tertiary;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .sign-value {
          font-size: 1.3rem;
          font-weight: $font-weight-bold;
          color: $primary-gold;
        }
      }
    }

    .astrology-wheel {
      background-color: $bg-secondary;
      padding: 40px;
      border-radius: $radius-2xl;
      border: 2px solid rgba($primary-gold, 0.2);
      text-align: center;

      .wheel-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .wheel-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        p {
          color: $text-tertiary;
          font-size: 0.85rem;
        }
      }
    }
  }
}

// Planets Section
.planets-section {
  margin-bottom: 40px;

  .planets-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .planet-card {
      background-color: $bg-secondary;
      padding: 16px;
      border-radius: $radius-xl;
      border: 1px solid rgba($primary-gold, 0.1);
      text-align: center;
      transition: all $transition-base;

      &:hover {
        border-color: $primary-gold;
        box-shadow: $shadow-lg;
        transform: translateY(-5px);
      }

      .planet-icon {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      h4 {
        font-size: 0.9rem;
        margin-bottom: 6px;
      }

      .planet-sign {
        font-size: 0.8rem;
        color: $primary-gold;
        margin-bottom: 3px;
      }

      .planet-degree {
        font-size: 0.7rem;
        color: $text-tertiary;
      }
    }
  }
}

// Moon Phase Section
.moon-phase-section {
  margin-bottom: 40px;

  .moon-phase-card {
    background: $gradient-purple-gold;
    padding: 24px;
    border-radius: $radius-2xl;
    display: flex;
    align-items: center;
    gap: 20px;

    .moon-icon {
      font-size: 3rem;
    }

    .moon-info {
      flex: 1;

      .phase-name {
        font-size: 1.5rem;
        font-weight: $font-weight-bold;
        margin-bottom: 8px;
      }

      .phase-illumination {
        font-size: 1rem;
        opacity: 0.9;
      }
    }
  }
}

// Retrograde Section
.retrograde-section {
  .retrograde-list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .retrograde-item {
      background-color: $bg-secondary;
      padding: 20px;
      border-radius: $radius-xl;
      border-left: 4px solid $warning-color;
      display: flex;
      gap: 16px;
      align-items: center;

      .retrograde-icon {
        font-size: 1.5rem;
      }

      .retrograde-info {
        flex: 1;

        h4 {
          margin: 0 0 4px 0;
          font-size: 1rem;
        }

        p {
          margin: 0;
          font-size: 0.875rem;
          color: $text-tertiary;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .birth-form form {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .planets-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .moon-phase-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;

    h1 {
      font-size: 1.875rem;
    }
  }

  .astrology-content {
    padding: 40px 0;
  }

  .birth-form form {
    grid-template-columns: 1fr;
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }

  .planets-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .astrology-wheel {
    padding: 40px;
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

  .astrology-content {
    padding: 30px 0;

    h2 {
      font-size: 1.25rem;
      margin-bottom: 20px;
    }
  }

  .birth-form {
    padding: 24px;

    h3 {
      font-size: 1rem;
    }
  }

  .planets-grid {
    grid-template-columns: 1fr;
  }

  .moon-phase-card {
    padding: 24px;

    .moon-icon {
      font-size: 2rem;
    }

    .moon-info {
      .phase-name {
        font-size: 1.125rem;
      }

      .phase-illumination {
        font-size: 0.875rem;
      }
    }
  }
}
</style>
