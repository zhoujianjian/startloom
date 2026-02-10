<template>
  <div class="numerology">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1>{{ $t('numerology_title') }}</h1>
        <p>{{ $t('numerology_subtitle') }}</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="numerology-content">
      <div class="container">
        <!-- Calculator Form -->
        <div class="calculator-form">
          <h2>{{ $t('numerology_calculate') }}</h2>
          
          <form @submit.prevent="calculate">
            <div class="form-group">
              <label>{{ $t('numerology_birth_date') }}</label>
              <input
                v-model="birthDate"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label>{{ $t('numerology_full_name') }}</label>
              <input
                v-model="fullName"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">{{ $t('numerology_calculate') }}</span>
              <span v-else>{{ $t('loading') }}</span>
            </button>
          </form>
        </div>

        <!-- Results Display -->
        <div v-if="results" class="results-display">
          <h2>Your Numerology Profile</h2>

          <!-- Main Numbers -->
          <div class="numbers-grid">
            <div class="number-card">
              <div class="number-value">{{ results.lifePathNumber }}</div>
              <h3>{{ $t('numerology_life_path') }}</h3>
              <p class="number-desc">{{ $t('numerology_life_path_desc') }}</p>
            </div>

            <div class="number-card">
              <div class="number-value">{{ results.destinyNumber }}</div>
              <h3>{{ $t('numerology_destiny') }}</h3>
              <p class="number-desc">{{ $t('numerology_destiny_desc') }}</p>
            </div>

            <div class="number-card">
              <div class="number-value">{{ results.personalYearNumber }}</div>
              <h3>{{ $t('numerology_personal_year') }}</h3>
              <p class="number-desc">{{ $t('numerology_personal_year_desc') }}</p>
            </div>

            <div class="number-card">
              <div class="number-value">{{ results.nameNumber }}</div>
              <h3>{{ $t('numerology_name_number') }}</h3>
              <p class="number-desc">{{ $t('numerology_name_desc') }}</p>
            </div>
          </div>

          <!-- Interpretations -->
          <div class="interpretations">
            <div class="interpretation-section">
              <h3>Life Path Number {{ results.lifePathNumber }}</h3>
              <p>{{ results.lifePathDescription }}</p>
            </div>

            <div class="interpretation-section">
              <h3>Destiny Number {{ results.destinyNumber }}</h3>
              <p>{{ results.destinyDescription }}</p>
            </div>

            <div class="interpretation-section">
              <h3>Personal Year {{ results.personalYearNumber }}</h3>
              <p>{{ results.personalYearDescription }}</p>
            </div>

            <div class="interpretation-section">
              <h3>Name Number {{ results.nameNumber }}</h3>
              <p>{{ results.nameDescription }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn btn-secondary" @click="saveResult">
              {{ $t('numerology_save_result') }}
            </button>
            <button class="btn btn-secondary" @click="shareResult">
              {{ $t('numerology_share_result') }}
            </button>
          </div>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <h2>Understanding Numerology</h2>
          <div class="info-grid">
            <div class="info-card">
              <h4>Life Path Number</h4>
              <p>Calculated from your birth date, this number reveals your natural talents, abilities, and life purpose.</p>
            </div>

            <div class="info-card">
              <h4>Destiny Number</h4>
              <p>Derived from your full name, this number shows your life goals, talents, and the path you're meant to follow.</p>
            </div>

            <div class="info-card">
              <h4>Personal Year Number</h4>
              <p>This number changes annually and indicates the energy and themes for the current year.</p>
            </div>

            <div class="info-card">
              <h4>Name Number</h4>
              <p>Calculated from the letters in your name, this number reflects your personality and character traits.</p>
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
  name: 'Numerology',
  data() {
    return {
      birthDate: '',
      fullName: ''
    }
  },
  computed: {
    ...mapState('western', ['numerologyResults', 'isLoading']),
    results() {
      return this.numerologyResults
    }
  },
  methods: {
    ...mapActions('western', ['calculateNumerology']),
    async calculate() {
      if (!this.birthDate || !this.fullName) {
        alert('Please fill in all fields')
        return
      }

      try {
        await this.calculateNumerology({
          birthDate: this.birthDate,
          fullName: this.fullName
        })
      } catch (error) {
        console.error('Failed to calculate numerology:', error)
      }
    },
    saveResult() {
      const saved = JSON.parse(localStorage.getItem('saved_numerology') || '[]')
      saved.push({
        ...this.results,
        savedAt: new Date().toISOString()
      })
      localStorage.setItem('saved_numerology', JSON.stringify(saved))
      alert('Result saved successfully!')
    },
    shareResult() {
      const text = `My numerology profile: Life Path ${this.results.lifePathNumber}, Destiny ${this.results.destinyNumber}`
      if (navigator.share) {
        navigator.share({
          title: 'My Numerology Profile',
          text: text
        })
      } else {
        alert('Share: ' + text)
      }
    }
  },
  mounted() {
    document.title = this.$t('seo_numerology_title')
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', this.$t('seo_numerology_desc'))
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.numerology {
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

// Numerology Content
.numerology-content {
  padding: 40px 0;

  h2 {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
}

// Calculator Form
.calculator-form {
  background-color: $bg-secondary;
  padding: 24px;
  border-radius: $radius-2xl;
  border: 1px solid rgba($primary-gold, 0.1);
  margin-bottom: 40px;

  form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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

// Results Display
.results-display {
  margin-bottom: 40px;

  h2 {
    margin-bottom: 20px;
  }

  // Numbers Grid
  .numbers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .number-card {
      background: $gradient-purple-gold;
      padding: 20px;
      border-radius: $radius-xl;
      text-align: center;
      box-shadow: $shadow-lg;
      transition: all $transition-base;

      &:hover {
        transform: translateY(-5px);
        box-shadow: $shadow-xl;
      }

      .number-value {
        font-size: 2.2rem;
        font-weight: $font-weight-bold;
        margin-bottom: 8px;
        color: $text-primary;
      }

      h3 {
        font-size: 0.9rem;
        margin-bottom: 6px;
        color: $text-primary;
      }

      .number-desc {
        font-size: 0.7rem;
        color: $text-secondary;
        line-height: 1.3;
      }
    }
  }

  // Interpretations
  .interpretations {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;

    .interpretation-section {
      background-color: $bg-secondary;
      padding: 24px;
      border-radius: $radius-xl;
      border-left: 4px solid $primary-gold;

      h3 {
        font-size: 1.125rem;
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

// Info Section
.info-section {
  background-color: $bg-secondary;
  padding: 40px;
  border-radius: $radius-2xl;
  border: 1px solid rgba($primary-gold, 0.1);

  h2 {
    margin-bottom: 30px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .info-card {
      background-color: $bg-primary;
      padding: 24px;
      border-radius: $radius-xl;
      border: 1px solid rgba($primary-gold, 0.1);

      h4 {
        font-size: 1.125rem;
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
}

// 响应式设计
@media (max-width: 1024px) {
  .calculator-form form {
    grid-template-columns: 1fr;
  }

  .numbers-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .interpretations {
    grid-template-columns: 1fr;
  }

  .info-grid {
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

  .numerology-content {
    padding: 40px 0;

    h2 {
      font-size: 1.5rem;
    }
  }

  .calculator-form {
    padding: 24px;
  }

  .numbers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .number-card {
      padding: 20px;

      .number-value {
        font-size: 2rem;
      }

      h3 {
        font-size: 0.875rem;
      }

      .number-desc {
        font-size: 0.7rem;
      }
    }
  }

  .interpretations {
    gap: 16px;

    .interpretation-section {
      padding: 20px;

      h3 {
        font-size: 1rem;
      }

      p {
        font-size: 0.8rem;
      }
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

  .numerology-content {
    padding: 30px 0;

    h2 {
      font-size: 1.25rem;
      margin-bottom: 20px;
    }
  }

  .calculator-form {
    padding: 20px;

    form {
      gap: 16px;
    }
  }

  .numbers-grid {
    grid-template-columns: 1fr;
    gap: 12px;

    .number-card {
      padding: 16px;

      .number-value {
        font-size: 1.75rem;
      }

      h3 {
        font-size: 0.8rem;
      }

      .number-desc {
        font-size: 0.65rem;
      }
    }
  }

  .interpretations {
    gap: 12px;

    .interpretation-section {
      padding: 16px;

      h3 {
        font-size: 0.95rem;
      }

      p {
        font-size: 0.75rem;
      }
    }
  }

  .action-buttons {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }

  .info-grid {
    gap: 16px;

    .info-card {
      padding: 16px;

      h4 {
        font-size: 1rem;
      }

      p {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
