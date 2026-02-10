<template>
  <div class="western-tools">
    <!-- Header -->
    <section class="page-header">
      <div class="container">
        <h1>{{ $t('tools_title') }}</h1>
        <p>{{ $t('tools_subtitle') }}</p>
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
            @click="selectTool(tool)"
          >
            <div class="tool-icon">{{ tool.icon }}</div>
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
            <button class="btn btn-text">Explore →</button>
          </div>
        </div>

        <!-- Tool Detail Modal -->
        <div v-if="selectedTool" class="tool-modal" @click="closeTool">
          <div class="modal-content" @click.stop>
            <button class="close-btn" @click="closeTool">✕</button>
            
            <div class="modal-header">
              <div class="modal-icon">{{ selectedTool.icon }}</div>
              <h2>{{ selectedTool.name }}</h2>
            </div>

            <div class="modal-body">
              <p>{{ selectedTool.fullDescription }}</p>

              <div class="tool-features">
                <h4>Features:</h4>
                <ul>
                  <li v-for="(feature, index) in selectedTool.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <button class="btn btn-primary" @click="useTool">
                Use {{ selectedTool.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'WesternTools',
  data() {
    return {
      selectedTool: null,
      tools: [
        {
          id: 'chakra-quiz',
          name: 'Chakra Quiz',
          icon: '🔮',
          description: 'Find your chakra balance',
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
    selectTool(tool) {
      this.selectedTool = tool
    },
    closeTool() {
      this.selectedTool = null
    },
    useTool() {
      alert(`Opening ${this.selectedTool.name}...`)
      this.closeTool()
    }
  },
  mounted() {
    document.title = this.$t('seo_tools_title')
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', this.$t('seo_tools_desc'))
    }
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
      font-size: 1rem;
      margin: 0;
    }

    p {
      font-size: 0.8rem;
      color: $text-secondary;
      margin: 0;
      flex-grow: 1;
    }

    .btn {
      align-self: center;
      padding: 8px 20px;
      font-size: 0.85rem;
    }
  }
}

// Tool Modal
.tool-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn $transition-base;

  .modal-content {
    background-color: $bg-secondary;
    border-radius: $radius-2xl;
    padding: 24px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    border: 2px solid $primary-gold;
    box-shadow: $shadow-2xl;

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 1.3rem;
      color: $primary-gold;
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        transform: scale(1.2);
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid rgba($primary-gold, 0.2);

      .modal-icon {
        font-size: 3rem;
      }

      h2 {
        margin: 0;
        font-size: 1.75rem;
      }
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 20px;

      p {
        font-size: 0.95rem;
        line-height: 1.6;
        color: $text-secondary;
      }

      .tool-features {
        background-color: $bg-primary;
        padding: 20px;
        border-radius: $radius-lg;
        border-left: 4px solid $primary-gold;

        h4 {
          font-size: 1rem;
          margin-bottom: 12px;
          color: $primary-gold;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 8px 0;
            font-size: 0.875rem;
            color: $text-secondary;

            &:before {
              content: '✓ ';
              color: $primary-gold;
              font-weight: $font-weight-bold;
              margin-right: 8px;
            }
          }
        }
      }

      .btn {
        padding: 12px 32px;
        align-self: center;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

  .tool-modal {
    .modal-content {
      padding: 24px;
      max-width: 90%;

      .modal-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;

        h2 {
          font-size: 1.5rem;
        }
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
        font-size: 0.8rem;
      }
    }
  }

  .tool-modal {
    padding: 10px;

    .modal-content {
      padding: 20px;
      max-width: 100%;

      .close-btn {
        top: 10px;
        right: 10px;
        font-size: 1.25rem;
      }

      .modal-header {
        margin-bottom: 20px;
        gap: 12px;

        .modal-icon {
          font-size: 2rem;
        }

        h2 {
          font-size: 1.25rem;
        }
      }

      .modal-body {
        gap: 16px;

        p {
          font-size: 0.875rem;
        }

        .tool-features {
          padding: 16px;

          h4 {
            font-size: 0.95rem;
          }

          ul li {
            font-size: 0.8rem;
          }
        }

        .btn {
          padding: 10px 24px;
          font-size: 0.875rem;
        }
      }
    }
  }
}
</style>
