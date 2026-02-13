<template>
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

      <AdSlot
        v-if="ads.enabled && ads.topSlot"
        class="ad-block"
        height="280px"
        :ad-enabled="ads.enabled"
        :ad-slot="ads.topSlot"
      />

      <div v-if="landing.highlights?.length" class="highlights">
        <h2 class="section-title">What you'll get</h2>
        <ul class="list">
          <li v-for="(item, idx) in landing.highlights" :key="idx" class="list-item">{{ item }}</li>
        </ul>
      </div>

      <div v-if="landing.faqs?.length" class="faq">
        <AdSlot
          v-if="ads.enabled && ads.faqSlot"
          class="ad-block"
          height="280px"
          :ad-enabled="ads.enabled"
          :ad-slot="ads.faqSlot"
        />
        <h2 class="section-title">FAQ</h2>
        <div class="faq-list">
          <details v-for="(faq, idx) in landing.faqs" :key="idx" class="faq-item">
            <summary class="faq-q">{{ faq.q }}</summary>
            <div class="faq-a">{{ faq.a }}</div>
          </details>
        </div>
      </div>

      <div v-if="landing.related?.length" class="related">
        <h2 class="section-title">Related</h2>
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
</template>

<script>
import AdSlot from '../../components/Western/AdSlot.vue'

export default {
  name: 'SeoLanding',
  components: { AdSlot },
  methods: {
    isExternal(to) {
      const s = String(to || '')
      return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('mailto:')
    }
  },
  computed: {
    ads() {
      if (typeof window === 'undefined') {
        return { enabled: false, topSlot: '', faqSlot: '' }
      }
      const enabled = localStorage.getItem('ads_enabled') === '1'
      const topSlot = localStorage.getItem('ads_slot_seo_top') || ''
      const faqSlot = localStorage.getItem('ads_slot_seo_faq') || ''
      return { enabled, topSlot, faqSlot }
    },
    landing() {
      const metaLanding = this.$route?.meta?.landing || {}
      return {
        heroTitle: metaLanding.heroTitle || this.$route?.meta?.title || 'StarLoom',
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

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.seo-landing {
  padding: 44px 0 64px;
  color: inherit;
}

.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 16px;
}

.hero {
  margin-bottom: 32px;
}

.ad-block {
  margin: 18px 0 0;
}

.hero-title {
  font-size: 38px;
  line-height: 1.18;
  font-weight: 700;
  margin: 0 0 14px;
  font-family: $font-family-display;
  background: linear-gradient(135deg, rgba($secondary-light-purple, 1) 0%, rgba($primary-teal, 1) 45%, rgba($primary-gold, 1) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 26px rgba($secondary-light-purple, 0.18);
}

.hero-intro {
  font-size: 18px;
  line-height: 1.75;
  opacity: 0.92;
  margin: 0 0 18px;
  color: $text-secondary;
}

.hero-cta {
  margin-top: 8px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 14px;
  letter-spacing: 0.2px;
}

.highlights,
.faq,
.related {
  margin-top: 32px;
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
  border: 1px solid rgba($primary-gold, 0.18);
  border-radius: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(10px);
  box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.08), 0 16px 40px rgba(0, 0, 0, 0.24);
}

.faq-q {
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
  color: $text-primary;
}

.faq-a {
  margin-top: 10px;
  line-height: 1.75;
  opacity: 0.9;
  font-size: 16px;
  color: $text-secondary;
}

.related-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.related-item {
  display: block;
  text-decoration: none;
  border: 1px solid rgba($primary-gold, 0.16);
  border-radius: 16px;
  padding: 16px 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(10px);
  color: inherit;
  transition: transform $transition-base, border-color $transition-base, box-shadow $transition-base;
}

.related-item:hover {
  border-color: rgba($primary-gold, 0.36);
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px rgba($primary-teal, 0.10), 0 18px 44px rgba(0, 0, 0, 0.28);
}

.related-title {
  font-weight: 700;
  margin-bottom: 4px;
  font-size: 16px;
  color: $text-primary;
}

.related-desc {
  font-size: 15px;
  opacity: 0.88;
  line-height: 1.6;
  color: $text-secondary;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  background: linear-gradient(135deg, rgba($secondary-light-purple, 1) 0%, rgba($primary-teal, 1) 60%, rgba($primary-gold, 1) 100%);
  color: $neutral-black;
  box-shadow: 0 0 0 1px rgba($primary-gold, 0.20), 0 14px 44px rgba($secondary-light-purple, 0.16);
  transition: transform $transition-base, filter $transition-base, box-shadow $transition-base;
}

.cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.05) saturate(1.12);
  box-shadow: 0 0 0 1px rgba($primary-gold, 0.28), 0 18px 54px rgba($primary-teal, 0.18);
}

.cta.secondary {
  background: rgba(255, 255, 255, 0.06);
  color: $text-primary;
  border: 1px solid rgba($primary-gold, 0.20);
  box-shadow: none;
  backdrop-filter: blur(10px);
}

.cta.secondary:hover {
  transform: translateY(-1px);
  border-color: rgba($primary-gold, 0.36);
}

.footer-cta {
  margin-top: 32px;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 46px;
  }

  .related-list {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
