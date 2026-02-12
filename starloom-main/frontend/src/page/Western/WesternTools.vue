<template>
  <div class="western-tools">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1>{{ $t('tools_title') }}</h1>
        <p>{{ $t('tools_subtitle') }}</p>
      </div>
    </section>

    <section class="popular">
      <div class="container">
        <h2>Popular</h2>
        <div class="popular-grid">
          <router-link to="/en/spiritual-guidance" class="popular-item">
            <h3>Spiritual Guidance Tools</h3>
            <p>Chakra quiz, crystals, affirmations, meditation, and more.</p>
          </router-link>
          <router-link to="/en/rising-sign" class="popular-item">
            <h3>Rising Sign (Ascendant) Calculator</h3>
            <p>Find your Ascendant and learn your first impression energy.</p>
          </router-link>
          <router-link to="/en/moon-sign" class="popular-item">
            <h3>Moon Sign Calculator</h3>
            <p>Explore your emotional needs and inner patterns.</p>
          </router-link>
          <router-link to="/en/personal-year" class="popular-item">
            <h3>Personal Year Number Calculator</h3>
            <p>Get a simple numerology forecast for the year ahead.</p>
          </router-link>
          <router-link to="/en/tarot-reading" class="popular-item">
            <h3>Free Tarot Reading Online</h3>
            <p>Instant AI tarot guidance in seconds.</p>
          </router-link>
          <router-link to="/en/tarot-spreads-for-beginners" class="popular-item">
            <h3>Tarot Spreads for Beginners</h3>
            <p>Simple layouts and position meanings.</p>
          </router-link>
          <router-link to="/en/zodiac-compatibility" class="popular-item">
            <h3>Zodiac Compatibility</h3>
            <p>Check love match for any two signs.</p>
          </router-link>
          <router-link to="/en/tarot/cards" class="popular-item">
            <h3>Tarot Card Meanings</h3>
            <p>Explore 78 card meanings and keywords.</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Tools Content -->
    <section class="tools-content">
      <div class="container">
        <!-- Tools Grid -->
        <div class="tools-grid">
          <div
            v-for="tool in tools"
            :key="tool.id"
            class="tool-card"
            @click="openTool(tool)"
          >
            <div class="tool-icon">{{ tool.icon }}</div>
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
            <button class="btn btn-text">Explore →</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { setSEO, setCanonical, setBreadcrumb, setHreflang } from '../../utils/seo'

export default {
  name: 'WesternTools',
  data() {
    return {
      tools: [
        {
          id: 'chakra-quiz',
          name: 'Chakra Quiz',
          icon: '🔮',
          description: 'Find your chakra balance',
          route: '/en/tools/chakra-quiz',
          fullDescription: 'Discover which of your seven chakras needs attention and healing. This interactive quiz will help you understand your energy centers.',
          features: [
            'Identify blocked chakras',
            'Get personalized recommendations',
            'Learn chakra balancing techniques',
            'Track your progress'
          ]
        },
        {
          id: 'crystal-guide',
          name: 'Crystal Guide',
          icon: '💎',
          description: 'Choose your healing crystal',
          route: '/en/tools/crystal-guide',
          fullDescription: 'Find the perfect crystal for your needs. Our guide will help you select crystals based on your intentions and goals.',
          features: [
            'Browse crystal database',
            'Filter by intention',
            'Learn crystal properties',
            'Get care instructions'
          ]
        },
        {
          id: 'affirmation',
          name: 'Affirmation Generator',
          icon: '✨',
          description: 'Daily affirmations for you',
          route: '/en/tools/affirmation-generator',
          fullDescription: 'Generate personalized affirmations tailored to your goals and aspirations. Start your day with positive energy.',
          features: [
            'Personalized affirmations',
            'Daily reminders',
            'Custom affirmation creation',
            'Share with friends'
          ]
        },
        {
          id: 'meditation',
          name: 'Meditation Timer',
          icon: '🧘',
          description: 'Guided meditation sessions',
          route: '/en/tools/meditation-timer',
          fullDescription: 'Meditate with our guided sessions and timer. Choose from various meditation styles and durations.',
          features: [
            'Multiple meditation styles',
            'Customizable duration',
            'Ambient sounds',
            'Progress tracking'
          ]
        },
        {
          id: 'energy-reading',
          name: 'Energy Reading',
          icon: '⚡',
          description: 'Analyze your energy field',
          route: '/en/tools/energy-reading',
          fullDescription: 'Get insights into your current energy state. Our AI will analyze your energy and provide recommendations.',
          features: [
            'Energy field analysis',
            'Personalized insights',
            'Recommendations',
            'Energy history'
          ]
        },
        {
          id: 'moon-calendar',
          name: 'Moon Calendar',
          icon: '🌙',
          description: 'Track moon phases',
          route: '/en/tools/moon-phase',
          fullDescription: 'Follow the lunar cycle and plan your activities accordingly. Understand how moon phases affect your energy.',
          features: [
            'Current moon phase',
            'Monthly calendar',
            'Moon rituals',
            'Lunar forecasts'
          ]
        }
      ]
    }
  },
  methods: {
    openTool(tool) {
      if (tool?.route) {
        this.$router.push(tool.route)
      }
    }
  },
  mounted() {
    setSEO('home', {
      title: 'Spiritual Tools (Free) | Chakra Quiz, Crystal Guide & More | StarLoom',
      description: 'Explore free spiritual tools: chakra quiz, crystal guide, affirmation generator, meditation timer, energy reading, and moon phase checker.',
      keywords: 'spiritual tools, chakra quiz, crystal guide, affirmation generator, meditation timer, moon phase'
    })
    setCanonical(this.$route.path)
    setHreflang({ en: `https://ibazi.site${this.$route.path}` })
    setBreadcrumb([
      { name: 'Home', url: 'https://ibazi.site/en' },
      { name: 'Tools', url: 'https://ibazi.site/en/tools' }
    ])
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.western-tools {
  width: 100%;
  background-color: $bg-primary;
  color: $text-primary;
}

.popular {
  padding: 22px 0 0;

  h2 {
    font-size: 1.1rem;
    margin: 0 0 14px;
  }

  .popular-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .popular-item {
    background: $bg-secondary;
    border: 2px solid rgba($primary-gold, 0.12);
    border-radius: $radius-2xl;
    padding: 16px;
    text-decoration: none;
    color: $text-primary;
    transition: all $transition-base;

    &:hover {
      border-color: $primary-gold;
      box-shadow: $shadow-lg;
      transform: translateY(-4px);
    }

    h3 {
      margin: 0 0 6px;
      font-size: 1.05rem;
    }

    p {
      margin: 0;
      color: $text-secondary;
      line-height: 1.6;
      font-size: 0.95rem;
    }
  }
}

// Page Header
.page-header {
  padding: 40px 0;
  background: $gradient-purple-gold;
  text-align: center;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 12px;
    color: $text-primary;
  }

  p {
    font-size: 1rem;
    color: $text-secondary;
  }
}

// Tools Content
.tools-content {
  padding: 40px 0;
}

// Tools Grid
.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  .tool-card {
    background-color: $bg-secondary;
    padding: 20px;
    border-radius: $radius-2xl;
    border: 2px solid rgba($primary-gold, 0.1);
    text-align: center;
    cursor: pointer;
    transition: all $transition-base;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &:hover {
      border-color: $primary-gold;
      box-shadow: $shadow-lg;
      transform: translateY(-8px);
    }

    .tool-icon {
      font-size: 2rem;
    }

    h3 {
      font-size: 1.15rem;
      margin: 0;
    }

    p {
      font-size: 0.95rem;
      color: $text-secondary;
      margin: 0;
      flex-grow: 1;
    }

    .btn {
      align-self: center;
      padding: 8px 20px;
      font-size: 0.95rem;
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;

    h1 {
      font-size: 1.875rem;
    }
  }

  .tools-content {
    padding: 40px 0;
  }

  .tools-grid {
    grid-template-columns: 1fr;
    gap: 20px;

    .tool-card {
      padding: 24px;

      .tool-icon {
        font-size: 2.5rem;
      }

      h3 {
        font-size: 1.125rem;
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

  .tools-content {
    padding: 30px 0;
  }

  .tools-grid {
    gap: 16px;

    .tool-card {
      padding: 20px;

      .tool-icon {
        font-size: 2rem;
      }

      h3 {
        font-size: 1rem;
      }

      p {
        font-size: 0.92rem;
      }
    }
  }

  
}
</style>
