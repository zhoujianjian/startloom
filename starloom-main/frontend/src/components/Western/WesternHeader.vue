<template>
  <header class="western-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/en" class="logo">
          <div class="logo-icon">✨</div>
          <span class="logo-text">StarLoom</span>
        </router-link>

        <!-- Navigation Menu -->
        <nav class="nav-menu" :class="{ active: mobileMenuOpen }">
          <router-link to="/en" class="nav-link" @click="closeMobileMenu">{{ $t('home') }}</router-link>
          <router-link to="/en/tarot" class="nav-link" @click="closeMobileMenu">{{ $t('tarot') }}</router-link>
          <router-link to="/en/tarot/cards" class="nav-link" @click="closeMobileMenu">Tarot Cards</router-link>
          <router-link to="/en/astrology" class="nav-link" @click="closeMobileMenu">{{ $t('astrology') }}</router-link>
          <router-link to="/en/horoscope" class="nav-link" @click="closeMobileMenu">{{ $t('horoscope') }}</router-link>
          <router-link to="/en/numerology" class="nav-link" @click="closeMobileMenu">{{ $t('numerology') }}</router-link>
          <router-link to="/en/compatibility" class="nav-link" @click="closeMobileMenu">Compatibility</router-link>
          <router-link to="/en/tools" class="nav-link" @click="closeMobileMenu">{{ $t('tools') }}</router-link>
        </nav>

        <!-- Right Section -->
        <div class="header-right">
          <!-- Language Switcher -->
          <div class="language-switcher">
            <button 
              class="lang-btn" 
              :class="{ active: currentLanguage === 'en' }"
              @click="switchLanguage('en')"
              title="English"
            >
              EN
            </button>
            <span class="lang-divider">|</span>
            <button 
              class="lang-btn" 
              :class="{ active: currentLanguage === 'zh' }"
              @click="switchLanguage('zh')"
              title="中文"
            >
              中
            </button>
          </div>

          <!-- Hamburger Menu -->
          <button 
            class="hamburger" 
            :class="{ active: mobileMenuOpen }"
            @click="toggleMobileMenu"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import i18n from '../../locales'

export default {
  name: 'WesternHeader',
  data() {
    return {
      mobileMenuOpen: false,
      currentLanguage: 'en'
    }
  },
  watch: {
    $route() {
      this.mobileMenuOpen = false
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    switchLanguage(lang) {
      this.currentLanguage = lang
      i18n.global.locale.value = lang
      localStorage.setItem('lang', lang)

      const path = this.$route?.path || '/en'
      const toZh = (enPath) => {
        const map = {
          '/en': '/',
          '/en/tools': '/tools',
          '/en/tarot': '/tool/tarot',
          '/en/compatibility': '/tool/constellation-match',
          '/en/horoscope': '/tool/daily-sign',
        }
        if (map[enPath]) return map[enPath]
        return '/'
      }
      const toEn = (zhPath) => {
        const map = {
          '/': '/en',
          '/tools': '/en/tools',
          '/tool/tarot': '/en/tarot',
          '/tool/constellation-match': '/en/compatibility',
          '/tool/daily-sign': '/en/horoscope',
        }
        if (map[zhPath]) return map[zhPath]
        return '/en'
      }

      // 切换版本：尽量保持同类页面，否则回首页
      this.mobileMenuOpen = false
      if (lang === 'zh') {
        const target = path.startsWith('/en') ? toZh(path) : path
        this.$router.push(target)
      } else {
        const target = path.startsWith('/en') ? path : toEn(path)
        this.$router.push(target)
      }
    }
  },
  mounted() {
    const saved = localStorage.getItem('lang')
    const inferred = this.$route?.path?.startsWith('/en') ? 'en' : 'zh'
    this.currentLanguage = saved || inferred
    i18n.global.locale.value = this.currentLanguage
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.western-header {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-bottom: 1px solid rgba($primary-gold, 0.16);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.western-header::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(700px 120px at 50% 0%, rgba($secondary-light-purple, 0.16) 0%, rgba($secondary-light-purple, 0) 65%),
    radial-gradient(500px 120px at 20% 0%, rgba($primary-teal, 0.10) 0%, rgba($primary-teal, 0) 70%);
  opacity: 0.9;
}

.western-header {
  .container {
    padding: 0 $spacing-lg;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    gap: $spacing-lg;
  }

  // Logo
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: $text-primary;
    font-weight: $font-weight-bold;
    font-size: 1.5rem;
    transition: all $transition-base;
    flex-shrink: 0;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.25));
    }

    .logo-icon {
      font-size: 2rem;
      animation: float 4.6s ease-in-out infinite;
    }

    .logo-text {
      font-family: $font-family-display;
      background: linear-gradient(135deg, rgba($secondary-light-purple, 1) 0%, rgba($primary-gold, 1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 1.4px;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  // Navigation Menu
  .nav-menu {
    display: flex;
    gap: 40px;
    align-items: center;
    flex: 1;
    justify-content: center;

    .nav-link {
      color: $text-secondary;
      text-decoration: none;
      font-weight: $font-weight-medium;
      font-size: 0.95rem;
      transition: all $transition-base;
      position: relative;
      padding: 8px 0;

      &:hover {
        color: $text-primary;
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: linear-gradient(90deg, rgba($primary-teal, 0) 0%, rgba($primary-teal, 0.9) 45%, rgba($primary-gold, 0.0) 100%);
        transform: scaleX(0);
        transform-origin: 50% 50%;
        transition: transform $transition-base, opacity $transition-base;
        opacity: 0;
        filter: drop-shadow(0 0 10px rgba($primary-teal, 0.22));
      }

      &:hover::after {
        transform: scaleX(1);
        opacity: 0.65;
      }

      &.router-link-active {
        color: $primary-gold;

        &::after {
          transform: scaleX(1);
          opacity: 1;
          background: linear-gradient(90deg, rgba($secondary-light-purple, 0) 0%, rgba($secondary-light-purple, 0.9) 42%, rgba($primary-gold, 0.0) 100%);
          filter: drop-shadow(0 0 12px rgba($secondary-light-purple, 0.20));
        }
      }
    }
  }

  // Header Right
  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-shrink: 0;
  }

  // Language Switcher
  .language-switcher {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 7px 10px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: $radius-lg;
    border: 1px solid rgba($primary-gold, 0.14);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    .lang-btn {
      background: none;
      border: none;
      color: $text-secondary;
      font-weight: $font-weight-semibold;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all $transition-base;
      padding: 4px 8px;
      border-radius: $radius-md;

      &:hover {
        color: $text-primary;
        background: rgba(255, 255, 255, 0.06);
      }

      &.active {
        color: $primary-gold;
        background: rgba($primary-gold, 0.12);
      }
    }

    .lang-divider {
      color: $border-medium;
      opacity: 0.5;
    }
  }

  // Hamburger Menu
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    transition: all $transition-base;

    span {
      width: 24px;
      height: 2px;
      background-color: $primary-gold;
      transition: all $transition-base;
      border-radius: 1px;
    }

    &:hover {
      opacity: 0.8;
    }

    &.active {
      span:nth-child(1) {
        transform: rotate(45deg) translate(8px, 8px);
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -7px);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .western-header {
    .nav-menu {
      gap: 24px;
    }

    .language-switcher {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .western-header {
    .header-content {
      height: 60px;
      gap: $spacing-md;
    }

    .logo {
      font-size: 1.25rem;
      gap: 8px;

      .logo-icon {
        font-size: 1.5rem;
      }

      .logo-text {
        display: none;
      }
    }

    .nav-menu {
      position: fixed;
      top: 60px;
      left: -100%;
      width: 100%;
      height: calc(100vh - 60px);
      background: linear-gradient(135deg, $bg-primary 0%, rgba($primary-purple, 0.1) 100%);
      flex-direction: column;
      gap: 0;
      transition: left $transition-base;
      z-index: 1000;
      padding: 20px 0;
      justify-content: flex-start;
      border-right: 2px solid rgba($primary-gold, 0.2);

      &.active {
        left: 0;
      }

      .nav-link {
        display: block;
        padding: 16px 24px;
        border-bottom: 1px solid rgba($primary-gold, 0.1);
        font-size: 1rem;

        &::after {
          display: none;
        }

        &.router-link-active {
          background-color: rgba($primary-gold, 0.1);
          border-left: 3px solid $primary-gold;
          padding-left: 21px;
        }
      }
    }

    .header-right {
      gap: 12px;
    }

    .language-switcher {
      display: flex;
    }

    .hamburger {
      display: flex;
    }
  }
}

@media (max-width: 640px) {
  .western-header {
    .header-content {
      height: 56px;
    }

    .logo {
      font-size: 1rem;

      .logo-icon {
        font-size: 1.25rem;
      }
    }

    .language-switcher {
      padding: 6px 10px;

      .lang-btn {
        font-size: 0.75rem;
        padding: 2px 6px;
      }
    }

    .hamburger {
      padding: 6px;

      span {
        width: 20px;
        height: 2px;
      }
    }
  }
}
</style>
