<template>
  <div class="topic-page" :class="'theme-' + currentTheme">
    <div class="page-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <span class="logo-icon">八字</span>
          <span class="logo-text">天机命理</span>
        </router-link>
      </div>
      <div class="header-nav">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/paipan" class="nav-item">八字排盘</router-link>
        <router-link to="/tools" class="nav-item">工具箱</router-link>
        <router-link to="/learn" class="nav-item">学习课堂</router-link>
      </div>
    </div>

    <section class="seo-landing">
      <div class="container">
        <header class="hero">
        <h1 class="hero-title">{{ landing.heroTitle }}</h1>
        <p v-if="landing.intro" class="hero-intro">{{ landing.intro }}</p>

        <div v-if="landing.primaryCta?.to" class="hero-cta">
          <a
            v-if="isExternal(landing.primaryCta.to)"
            class="cta"
            :href="landing.primaryCta.to"
            target="_blank"
            rel="noopener"
          >{{ landing.primaryCta.text }}</a>
          <router-link v-else class="cta" :to="landing.primaryCta.to">{{ landing.primaryCta.text }}</router-link>
        </div>
      </header>

      <div v-if="landing.highlights?.length" class="highlights">
        <h2 class="section-title">你将获得</h2>
        <ul class="list">
          <li v-for="(item, idx) in landing.highlights" :key="idx" class="list-item">{{ item }}</li>
        </ul>
      </div>

      <div v-if="landing.faqs?.length" class="faq">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <details v-for="(faq, idx) in landing.faqs" :key="idx" class="faq-item">
            <summary class="faq-q">{{ faq.q }}</summary>
            <div class="faq-a">{{ faq.a }}</div>
          </details>
        </div>
      </div>

      <div v-if="landing.related?.length" class="related">
        <h2 class="section-title">相关内容</h2>
        <div class="related-list">
          <router-link v-for="(link, idx) in landing.related" :key="idx" class="related-item" :to="link.to">
            <div class="related-title">{{ link.title }}</div>
            <div v-if="link.description" class="related-desc">{{ link.description }}</div>
          </router-link>
        </div>
      </div>

        <footer v-if="landing.secondaryCta?.to" class="footer-cta">
          <router-link class="cta secondary" :to="landing.secondaryCta.to">{{ landing.secondaryCta.text }}</router-link>
        </footer>
      </div>
    </section>
  </div>
</template>

<script>
import { getCurrentTheme, initTheme } from '../utils/themes'

export default {
  name: 'SeoLandingZh',
  data() {
    return {
      currentTheme: getCurrentTheme()
    }
  },
  mounted() {
    initTheme()
    window.addEventListener('storage', this.handleStorage)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorage)
  },
  methods: {
    isExternal(to) {
      const s = String(to || '')
      return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('mailto:')
    },
    handleStorage(e) {
      if (e && e.key === 'starloom-theme') {
        this.currentTheme = getCurrentTheme()
        initTheme()
      }
    }
  },
  computed: {
    landing() {
      const metaLanding = this.$route?.meta?.landing || {}
      return {
        heroTitle: metaLanding.heroTitle || this.$route?.meta?.title || '天机命理',
        intro: metaLanding.intro || '',
        highlights: Array.isArray(metaLanding.highlights) ? metaLanding.highlights : [],
        faqs: Array.isArray(metaLanding.faqs) ? metaLanding.faqs : [],
        related: Array.isArray(metaLanding.related) ? metaLanding.related : [],
        primaryCta: metaLanding.primaryCta || null,
        secondaryCta: metaLanding.secondaryCta || null,
      }
    }
  }
}
</script>

<style scoped>
.topic-page {
  width: 100%;
  min-height: 100vh;
  background: var(--bgPrimary, #f7f8fb);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--borderLight, rgba(0, 0, 0, 0.06));
  background: var(--bgHeader, #fff);
  backdrop-filter: blur(12px);
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--textPrimary, inherit);
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--primaryGradient, linear-gradient(135deg, #7B5CF5 0%, #9D4EDD 100%));
  color: var(--textPrimary, #fff);
  font-weight: 800;
  font-size: 14px;
}

.logo-text {
  font-weight: 800;
  font-size: 16px;
  color: var(--textPrimary, #111827);
}

.header-nav {
  display: none;
  gap: 14px;
}

.nav-item {
  text-decoration: none;
  color: var(--textSecondary, rgba(17, 24, 39, 0.86));
  font-weight: 700;
  font-size: 14px;
}

.nav-item.router-link-active {
  color: var(--primary, #7B5CF5);
}

.seo-landing {
  padding: 26px 0 64px;
  color: var(--textPrimary, rgba(17, 24, 39, 0.92));
  background: transparent;
}

.container {
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 16px;
}

.hero {
  margin-bottom: 20px;
}

.hero-title {
  font-size: 34px;
  line-height: 1.18;
  font-weight: 800;
  margin: 0 0 14px;
}

.hero-intro {
  font-size: 16px;
  line-height: 1.75;
  color: var(--textSecondary, rgba(17, 24, 39, 0.78));
  margin: 0 0 18px;
}

.hero-cta {
  margin-top: 8px;
}

.section-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 14px;
}

.highlights,
.faq,
.related {
  margin-top: 32px;
}

.highlights,
.faq,
.related,
.hero {
  border: 1px solid var(--border, rgba(17, 24, 39, 0.08));
  border-radius: 14px;
  background: var(--bgCard, #fff);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
  padding: 16px;
}

.hero {
  padding: 18px;
}

.list {
  margin: 0;
  padding-left: 20px;
}

.list-item {
  margin: 10px 0;
  line-height: 1.75;
  font-size: 16px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  border: 1px solid var(--borderLight, rgba(17, 24, 39, 0.08));
  border-radius: 10px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.04);
}

.faq-q {
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.5;
}

.faq-a {
  margin-top: 10px;
  line-height: 1.75;
  opacity: 0.9;
  font-size: 16px;
}

.related-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.related-item {
  display: block;
  text-decoration: none;
  border: 1px solid var(--borderLight, rgba(17, 24, 39, 0.08));
  border-radius: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--textPrimary, inherit);
}

.related-item:hover {
  border-color: var(--borderHover, rgba(123, 92, 245, 0.35));
  background: rgba(255, 255, 255, 0.08);
}

.related-title {
  font-weight: 800;
  margin-bottom: 4px;
  font-size: 16px;
}

.related-desc {
  font-size: 15px;
  opacity: 0.88;
  line-height: 1.6;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 16px;
  text-decoration: none;
  background: var(--primaryGradient, linear-gradient(135deg, #7B5CF5 0%, #9D4EDD 100%));
  color: #fff;
}

.cta.secondary {
  background: transparent;
  color: var(--textPrimary, rgba(17, 24, 39, 0.86));
  border: 1px solid var(--border, rgba(17, 24, 39, 0.16));
}

.footer-cta {
  margin-top: 32px;
}

@media (min-width: 768px) {
  .header-nav {
    display: flex;
  }

  .hero-title {
    font-size: 42px;
  }

  .related-list {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
