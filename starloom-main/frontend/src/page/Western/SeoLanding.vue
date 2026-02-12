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

<style scoped>
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
}

.hero-intro {
  font-size: 18px;
  line-height: 1.75;
  opacity: 0.92;
  margin: 0 0 18px;
}

.hero-cta {
  margin-top: 8px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 14px;
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
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.06);
}

.faq-q {
  cursor: pointer;
  font-weight: 600;
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
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
}

.related-item:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
}

.related-title {
  font-weight: 700;
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
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  background: #111827;
  color: #fff;
}

.cta.secondary {
  background: transparent;
  color: #111827;
  border: 1px solid rgba(17, 24, 39, 0.2);
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
