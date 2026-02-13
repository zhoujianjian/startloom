<template>
  <div class="western-home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('home_title') }}</h1>
          <p class="hero-subtitle">{{ $t('home_subtitle') }}</p>
          <div class="hero-buttons">
            <router-link to="/en/tarot" class="btn btn-primary">{{ $t('tarot') }}</router-link>
            <router-link to="/en/astrology" class="btn btn-secondary">{{ $t('astrology') }}</router-link>
          </div>
        </div>
        <div class="hero-image">
          <div class="mystical-circle"></div>
          <div class="mystical-circle-2"></div>
        </div>
      </div>
    </section>

    <section class="popular">
      <div class="container">
        <h2>Popular</h2>
        <div class="popular-grid">
          <router-link to="/en/tarot-reading" class="popular-item">
            <h3>Free Tarot Reading Online</h3>
            <p>Instant AI guidance for love, career, and clarity.</p>
          </router-link>
          <router-link to="/en/how-to-do-a-tarot-reading" class="popular-item">
            <h3>How to Do a Tarot Reading (Beginner Guide)</h3>
            <p>Step-by-step guide: questions, spreads, and interpretations.</p>
          </router-link>
          <router-link to="/en/tarot-spreads-for-beginners" class="popular-item">
            <h3>Tarot Spreads for Beginners</h3>
            <p>Simple 1-card and 3-card layouts explained.</p>
          </router-link>
          <router-link to="/en/tarot-love-reading" class="popular-item">
            <h3>Love Tarot Reading</h3>
            <p>Relationship insights and next steps.</p>
          </router-link>
          <router-link to="/en/zodiac-compatibility" class="popular-item">
            <h3>Zodiac Compatibility</h3>
            <p>Check love compatibility for any two signs.</p>
          </router-link>
          <router-link to="/en/rising-sign" class="popular-item">
            <h3>Rising Sign (Ascendant) Calculator</h3>
            <p>Discover your first impression and outer personality.</p>
          </router-link>
          <router-link to="/en/moon-sign" class="popular-item">
            <h3>Moon Sign Calculator</h3>
            <p>Explore emotional needs and inner patterns.</p>
          </router-link>
          <router-link to="/en/how-to-read-a-birth-chart" class="popular-item">
            <h3>How to Read a Birth Chart</h3>
            <p>Beginner guide to planets, houses, and your Big Three.</p>
          </router-link>
          <router-link to="/en/tarot/cards" class="popular-item">
            <h3>Tarot Card Meanings (78 Cards)</h3>
            <p>Major & Minor Arcana meanings, keywords, and reflections.</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Quick Access Cards -->
    <section class="quick-access">
      <div class="container">
        <h2>{{ $t('home_quick_access') }}</h2>
        <div class="card-grid">
          <router-link to="/en/tarot" class="quick-card">
            <div class="card-icon tarot-icon">🃏</div>
            <h3>{{ $t('home_daily_tarot') }}</h3>
            <p>{{ $t('home_daily_tarot_desc') }}</p>
          </router-link>

          <router-link to="/en/horoscope" class="quick-card">
            <div class="card-icon horoscope-icon">♈</div>
            <h3>{{ $t('home_todays_horoscope') }}</h3>
            <p>{{ $t('home_todays_horoscope_desc') }}</p>
          </router-link>

          <router-link to="/en/astrology" class="quick-card">
            <div class="card-icon astrology-icon">🌙</div>
            <h3>{{ $t('home_birth_chart') }}</h3>
            <p>{{ $t('home_birth_chart_desc') }}</p>
          </router-link>

          <router-link to="/en/numerology" class="quick-card">
            <div class="card-icon numerology-icon">🔢</div>
            <h3>{{ $t('home_numerology') }}</h3>
            <p>{{ $t('home_numerology_desc') }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Readings -->
    <section class="featured">
      <div class="container">
        <h2>{{ $t('home_featured') }}</h2>
        <div class="featured-grid">
          <div class="featured-card">
            <div class="featured-image">
              <div class="placeholder-image">✨</div>
            </div>
            <h3>Understanding Your Birth Chart</h3>
            <p>Learn how to interpret the planets and houses in your natal chart...</p>
            <a href="#" class="read-more">Read More →</a>
          </div>

          <div class="featured-card">
            <div class="featured-image">
              <div class="placeholder-image">🔮</div>
            </div>
            <h3>Tarot Spreads for Beginners</h3>
            <p>Master the most popular tarot spreads and their meanings...</p>
            <a href="#" class="read-more">Read More →</a>
          </div>

          <div class="featured-card">
            <div class="featured-image">
              <div class="placeholder-image">🌟</div>
            </div>
            <h3>Mercury Retrograde Guide</h3>
            <p>Navigate the challenges of Mercury retrograde with our expert tips...</p>
            <a href="#" class="read-more">Read More →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials">
      <div class="container">
        <h2>{{ $t('home_testimonials') }}</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"StarLoom's tarot readings have been incredibly accurate and insightful. I've found clarity in my life through their guidance."</p>
            <div class="testimonial-author">
              <div class="author-avatar">👤</div>
              <div>
                <p class="author-name">Sarah M.</p>
                <p class="author-title">Spiritual Seeker</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"The birth chart analysis helped me understand myself better. Highly recommended for anyone interested in astrology!"</p>
            <div class="testimonial-author">
              <div class="author-avatar">👤</div>
              <div>
                <p class="author-name">James L.</p>
                <p class="author-title">Astrology Enthusiast</p>
              </div>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p>"The numerology calculator revealed so much about my life path. This platform is a game-changer!"</p>
            <div class="testimonial-author">
              <div class="author-avatar">👤</div>
              <div>
                <p class="author-name">Emma R.</p>
                <p class="author-title">Personal Development Coach</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Discover Your Cosmic Destiny?</h2>
        <p>Join thousands of users who have found clarity and guidance through StarLoom</p>
        <button class="btn btn-primary">{{ $t('home_cta_button') }}</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'WesternHome',
  data() {
    return {
      // 组件数据
    }
  },
  mounted() {
    // 设置 SEO 元数据
    document.title = this.$t('seo_home_title')
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', this.$t('seo_home_desc'))
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.western-home {
  width: 100%;
  background-color: transparent;
  color: $text-primary;
}

.popular {
  padding: 26px 0 10px;

  h2 {
    font-size: 0.95rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $text-tertiary;
    margin: 0 0 14px;
    position: relative;
    display: inline-block;
  }

  h2::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 64px;
    height: 2px;
    background: linear-gradient(90deg, rgba($primary-teal, 0) 0%, rgba($primary-teal, 0.65) 45%, rgba($primary-gold, 0) 100%);
    filter: drop-shadow(0 0 10px rgba($primary-teal, 0.18));
    opacity: 0.9;
  }

  .popular-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .popular-item {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
    border: 1px solid rgba($primary-gold, 0.16);
    border-radius: $radius-2xl;
    padding: 16px;
    text-decoration: none;
    color: $text-primary;
    transition: all $transition-base;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.08), 0 18px 44px rgba(0, 0, 0, 0.32);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(520px 220px at 15% 10%, rgba($secondary-light-purple, 0.10) 0%, rgba($secondary-light-purple, 0) 60%);
      opacity: 0;
      transition: opacity $transition-base;
      pointer-events: none;
    }

    &:hover {
      border-color: rgba($primary-gold, 0.32);
      box-shadow: 0 0 0 1px rgba($primary-teal, 0.10), 0 22px 54px rgba(0, 0, 0, 0.38);
      transform: translateY(-4px);
    }

    &:hover::before {
      opacity: 1;
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

// Hero Section
.hero {
  padding: 40px 0;
  background: transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba($primary-purple, 0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -18% -10% -26% -10%;
    background:
      radial-gradient(1.8px 1.8px at 12% 22%, rgba(255, 255, 255, 0.55) 45%, rgba(255, 255, 255, 0) 60%),
      radial-gradient(1.4px 1.4px at 22% 72%, rgba(255, 255, 255, 0.42) 45%, rgba(255, 255, 255, 0) 60%),
      radial-gradient(2.2px 2.2px at 36% 34%, rgba(255, 255, 255, 0.52) 45%, rgba(255, 255, 255, 0) 60%),
      radial-gradient(1.6px 1.6px at 48% 62%, rgba(255, 255, 255, 0.40) 45%, rgba(255, 255, 255, 0) 60%),
      radial-gradient(2.4px 2.4px at 58% 18%, rgba(255, 255, 255, 0.58) 45%, rgba(255, 255, 255, 0) 60%),
      radial-gradient(1.4px 1.4px at 66% 72%, rgba(255, 255, 255, 0.38) 45%, rgba(255, 255, 255, 0) 60%),
      radial-gradient(2.8px 2.8px at 74% 30%, rgba($primary-gold, 0.42) 45%, rgba($primary-gold, 0) 62%),
      radial-gradient(1.8px 1.8px at 82% 58%, rgba($primary-teal, 0.40) 45%, rgba($primary-teal, 0) 62%),
      radial-gradient(2.8px 2.8px at 62% 28%, rgba($primary-gold, 0.46) 45%, rgba($primary-gold, 0) 64%),
      radial-gradient(2.4px 2.4px at 70% 35%, rgba(255, 255, 255, 0.52) 45%, rgba(255, 255, 255, 0) 64%),
      radial-gradient(2.2px 2.2px at 78% 42%, rgba($primary-teal, 0.44) 45%, rgba($primary-teal, 0) 64%),
      radial-gradient(2.6px 2.6px at 84% 46%, rgba(255, 255, 255, 0.50) 45%, rgba(255, 255, 255, 0) 64%),
      radial-gradient(2.6px 2.6px at 68% 48%, rgba(255, 255, 255, 0.48) 45%, rgba(255, 255, 255, 0) 64%),
      radial-gradient(2.2px 2.2px at 64% 56%, rgba($primary-gold, 0.38) 45%, rgba($primary-gold, 0) 64%),
      linear-gradient(22deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 49.65%, rgba(255, 255, 255, 0.040) 50%, rgba(0, 0, 0, 0) 50.35%, rgba(0, 0, 0, 0) 100%),
      linear-gradient(64deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 56.65%, rgba($primary-teal, 0.040) 57%, rgba(0, 0, 0, 0) 57.35%, rgba(0, 0, 0, 0) 100%),
      linear-gradient(-16deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 44.65%, rgba($primary-gold, 0.045) 45%, rgba(0, 0, 0, 0) 45.35%, rgba(0, 0, 0, 0) 100%),
      radial-gradient(circle at 72% 32%, rgba(0, 0, 0, 0) 56%, rgba(255, 255, 255, 0.10) 56.7%, rgba(0, 0, 0, 0) 57.4%),
      radial-gradient(circle at 72% 32%, rgba(0, 0, 0, 0) 70%, rgba($primary-gold, 0.12) 70.7%, rgba(0, 0, 0, 0) 71.4%),
      radial-gradient(740px 420px at 70% 28%, rgba($secondary-light-purple, 0.10) 0%, rgba($secondary-light-purple, 0) 62%),
      linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba($primary-teal, 0.10) 42%, rgba(255, 255, 255, 0) 74%),
      linear-gradient(35deg, rgba(255, 255, 255, 0) 0%, rgba($secondary-light-purple, 0.10) 44%, rgba(255, 255, 255, 0) 76%),
      repeating-conic-gradient(from -90deg, rgba(0, 0, 0, 0) 0deg, rgba(0, 0, 0, 0) 11deg, rgba($primary-teal, 0.08) 11.6deg, rgba(0, 0, 0, 0) 12deg),
      repeating-linear-gradient(45deg, rgba($primary-gold, 0) 0px, rgba($primary-gold, 0) 10px, rgba($primary-gold, 0.040) 11px, rgba($primary-gold, 0) 12px);
    opacity: 0.52;
    pointer-events: none;
    mix-blend-mode: overlay;
    filter: blur(0.55px) drop-shadow(0 0 16px rgba($secondary-light-purple, 0.06)) drop-shadow(0 0 12px rgba($primary-gold, 0.06));
    mask-image: radial-gradient(circle at 72% 32%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.74) 48%, rgba(0, 0, 0, 0) 78%);
    -webkit-mask-image: radial-gradient(circle at 72% 32%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.74) 48%, rgba(0, 0, 0, 0) 78%);
    transform: translate(calc(var(--mx, 0) * 14px), calc(var(--my, 0) * 12px));
    transition: opacity $transition-base;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .hero-title {
    font-size: 2.25rem;
    font-family: $font-family-display;
    letter-spacing: 0.6px;
    background: linear-gradient(135deg, rgba($neutral-cream, 1) 0%, rgba($secondary-light-purple, 0.95) 40%, rgba($primary-gold, 0.92) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.12;
    text-shadow: 0 0 24px rgba($secondary-light-purple, 0.08);
    margin: 0;
  }

  .hero-subtitle {
    font-size: 1rem;
    color: $text-secondary;
    line-height: 1.6;
    max-width: 520px;
    margin: 0;
  }

  .hero-buttons {
    display: flex;
    gap: 12px;
    align-items: center;

    .btn {
      padding: 11px 22px;
      font-size: 0.95rem;
      border-radius: 999px;
      font-weight: $font-weight-semibold;
      letter-spacing: 0.2px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: transform $transition-base, box-shadow $transition-base, filter $transition-base, background $transition-base;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0.0;
      background: radial-gradient(240px 120px at 30% 30%, rgba($primary-teal, 0.18) 0%, rgba($primary-teal, 0) 70%);
      transition: opacity $transition-base;
      pointer-events: none;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn:hover::before {
      opacity: 1;
    }

    .btn:active {
      transform: translateY(0px);
    }

    .btn-primary {
      background: linear-gradient(135deg, rgba($secondary-light-purple, 0.92) 0%, rgba($primary-teal, 0.70) 55%, rgba($primary-gold, 0.92) 100%);
      color: $neutral-black;
      box-shadow: 0 0 0 1px rgba($primary-gold, 0.20), 0 18px 46px rgba(0, 0, 0, 0.26);
    }

    .btn-primary:hover {
      filter: brightness(1.02) saturate(1.08);
      box-shadow: 0 0 0 1px rgba($primary-gold, 0.28), 0 22px 56px rgba(0, 0, 0, 0.32);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.06);
      color: $text-primary;
      border: 1px solid rgba($primary-gold, 0.16);
      box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.06);
    }

    .btn-secondary:hover {
      border-color: rgba($primary-gold, 0.28);
      box-shadow: 0 0 0 1px rgba($primary-teal, 0.10), 0 18px 54px rgba(0, 0, 0, 0.30);
    }
  }

  .hero-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    position: relative;
  }

  .hero-image::before {
    content: '';
    position: absolute;
    width: 520px;
    height: 520px;
    right: -120px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    background:
      radial-gradient(520px 520px at 50% 50%, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 38%, rgba(255, 255, 255, 0) 66%),
      radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 52%, rgba($primary-gold, 0.10) 52.6%, rgba(0, 0, 0, 0) 53.2%),
      radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 66%, rgba($primary-teal, 0.075) 66.6%, rgba(0, 0, 0, 0) 67.2%),
      radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 78%, rgba($secondary-light-purple, 0.08) 78.6%, rgba(0, 0, 0, 0) 79.2%),
      repeating-conic-gradient(from -90deg, rgba(0, 0, 0, 0) 0deg, rgba(0, 0, 0, 0) 10deg, rgba($primary-gold, 0.05) 10.6deg, rgba(0, 0, 0, 0) 11deg),
      repeating-conic-gradient(from -90deg, rgba(0, 0, 0, 0) 0deg, rgba(0, 0, 0, 0) 28deg, rgba(255, 255, 255, 0.028) 28.6deg, rgba(0, 0, 0, 0) 29deg),
      radial-gradient(2px 2px at 22% 34%, rgba(255, 255, 255, 0.32) 45%, rgba(255, 255, 255, 0) 70%),
      radial-gradient(1.6px 1.6px at 34% 70%, rgba(255, 255, 255, 0.26) 45%, rgba(255, 255, 255, 0) 70%),
      radial-gradient(2.6px 2.6px at 68% 28%, rgba($primary-gold, 0.30) 45%, rgba($primary-gold, 0) 72%),
      radial-gradient(2.2px 2.2px at 74% 62%, rgba($primary-teal, 0.26) 45%, rgba($primary-teal, 0) 72%),
      url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'%3E%3Cdefs%3E%3Cstyle%3Etext%7Bfont-family:Georgia,serif;font-size:36px;fill:rgba(195,232,255,0.58);letter-spacing:2px;%7D%3C/style%3E%3C/defs%3E%3Ccircle%20cx='256'%20cy='256'%20r='212'%20fill='none'%20stroke='rgba(195,232,255,0.18)'%20stroke-width='2'/%3E%3Cg%20text-anchor='middle'%20dominant-baseline='middle'%3E%3Ctext%20x='256'%20y='44'%3E%E2%99%88%3C/text%3E%3Ctext%20x='355'%20y='70'%3E%E2%99%89%3C/text%3E%3Ctext%20x='432'%20y='145'%3E%E2%99%8A%3C/text%3E%3Ctext%20x='468'%20y='256'%3E%E2%99%8B%3C/text%3E%3Ctext%20x='432'%20y='367'%3E%E2%99%8C%3C/text%3E%3Ctext%20x='355'%20y='442'%3E%E2%99%8D%3C/text%3E%3Ctext%20x='256'%20y='468'%3E%E2%99%8E%3C/text%3E%3Ctext%20x='157'%20y='442'%3E%E2%99%8F%3C/text%3E%3Ctext%20x='80'%20y='367'%3E%E2%99%90%3C/text%3E%3Ctext%20x='44'%20y='256'%3E%E2%99%91%3C/text%3E%3Ctext%20x='80'%20y='145'%3E%E2%99%92%3C/text%3E%3Ctext%20x='157'%20y='70'%3E%E2%99%93%3C/text%3E%3C/g%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0.58;
    pointer-events: none;
    mix-blend-mode: screen;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
    filter: blur(0.08px) drop-shadow(0 0 34px rgba($secondary-light-purple, 0.14)) drop-shadow(0 0 26px rgba($primary-teal, 0.12)) drop-shadow(0 0 18px rgba($primary-gold, 0.10));
    mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.85) 28%, rgba(0, 0, 0, 1) 52%, rgba(0, 0, 0, 0) 78%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.85) 28%, rgba(0, 0, 0, 1) 52%, rgba(0, 0, 0, 0) 78%);
    animation: zodiacRotate 90s linear infinite;
  }

  .mystical-circle {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 60%, rgba($primary-gold, 0.14) 60.6%, rgba(0, 0, 0, 0) 61.2%),
      radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 76%, rgba($secondary-light-purple, 0.12) 76.6%, rgba(0, 0, 0, 0) 77.2%),
      repeating-conic-gradient(from -90deg, rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0) 14deg, rgba($primary-teal, 0.16) 14.6deg, rgba(255, 255, 255, 0) 15deg);
    opacity: 0.34;
    animation: float 6s ease-in-out infinite;
    filter: blur(0.15px) drop-shadow(0 0 22px rgba($primary-gold, 0.10));
  }

  .mystical-circle-2 {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 58%, rgba($primary-teal, 0.12) 58.6%, rgba(0, 0, 0, 0) 59.2%),
      repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0) 28deg, rgba($secondary-light-purple, 0.12) 28.7deg, rgba(255, 255, 255, 0) 29deg);
    opacity: 0.28;
    animation: float 8s ease-in-out infinite reverse;
    filter: blur(0.2px);
  }
}

@media (min-width: 768px) {
  .hero {
    padding: 64px 0;

    .hero-title {
      font-size: 3.1rem;
      letter-spacing: 0.9px;
    }

    .hero-subtitle {
      font-size: 1.06rem;
      max-width: 560px;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes zodiacRotate {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero .hero-image::before {
    animation: none;
  }
}

// Quick Access Cards
.quick-access {
  padding: 40px 0;
  background-color: transparent;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 0.95rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $text-tertiary;
    position: relative;
    display: inline-block;
  }

  h2::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 86px;
    height: 2px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, rgba($secondary-light-purple, 0) 0%, rgba($secondary-light-purple, 0.70) 42%, rgba($primary-gold, 0) 100%);
    filter: drop-shadow(0 0 10px rgba($secondary-light-purple, 0.18));
    opacity: 0.9;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .quick-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 16px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025));
    border-radius: $radius-2xl;
    border: 1px solid rgba($primary-gold, 0.14);
    transition: all $transition-base;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.06), 0 16px 42px rgba(0, 0, 0, 0.28);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(520px 220px at 20% 10%, rgba($primary-teal, 0.08) 0%, rgba($primary-teal, 0) 60%);
      opacity: 0;
      transition: opacity $transition-base;
      pointer-events: none;
    }

    &:hover {
      border-color: rgba($primary-gold, 0.30);
      box-shadow: 0 0 0 1px rgba($primary-teal, 0.10), 0 18px 52px rgba(0, 0, 0, 0.34);
      transform: translateY(-5px);
    }

    &:hover::before {
      opacity: 1;
    }

    .card-icon {
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: rgba($primary-gold, 0.08);
      border-radius: $radius-xl;
      box-shadow: 0 0 0 1px rgba($primary-gold, 0.14);
    }

    h3 {
      font-size: 0.95rem;
      text-align: center;
      margin: 0;
    }

    p {
      font-size: 0.75rem;
      text-align: center;
      color: $text-tertiary;
      margin: 0;
    }
  }
}

// Featured Section
.featured {
  padding: 40px 0;
  background-color: transparent;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 0.95rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $text-tertiary;
    position: relative;
    display: inline-block;
  }

  h2::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 86px;
    height: 2px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, rgba($primary-teal, 0) 0%, rgba($primary-teal, 0.60) 45%, rgba($primary-gold, 0) 100%);
    filter: drop-shadow(0 0 10px rgba($primary-teal, 0.16));
    opacity: 0.9;
  }

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .featured-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.025));
    border-radius: $radius-2xl;
    overflow: hidden;
    transition: all $transition-base;
    border: 1px solid rgba($primary-gold, 0.14);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.06), 0 16px 42px rgba(0, 0, 0, 0.28);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(520px 220px at 20% 10%, rgba($secondary-light-purple, 0.08) 0%, rgba($secondary-light-purple, 0) 62%),
        radial-gradient(520px 220px at 80% 80%, rgba($primary-teal, 0.06) 0%, rgba($primary-teal, 0) 62%),
        repeating-conic-gradient(from 210deg, rgba($primary-gold, 0.04) 0deg, rgba($primary-gold, 0.04) 2deg, rgba(0, 0, 0, 0) 10deg, rgba(0, 0, 0, 0) 18deg);
      opacity: 0.0;
      transition: opacity $transition-base;
      pointer-events: none;
      mix-blend-mode: screen;
      filter: blur(0.2px);
    }

    &::after {
      content: '';
      position: absolute;
      inset: -35% -35% auto auto;
      width: 320px;
      height: 320px;
      background:
        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 58%, rgba($primary-gold, 0.08) 58.6%, rgba(0, 0, 0, 0) 59.2%),
        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 72%, rgba($primary-teal, 0.06) 72.6%, rgba(0, 0, 0, 0) 73.2%),
        repeating-conic-gradient(from -90deg, rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0) 15deg, rgba($secondary-light-purple, 0.06) 15.6deg, rgba(255, 255, 255, 0) 16deg);
      opacity: 0.55;
      pointer-events: none;
      mask-image: radial-gradient(circle at 70% 30%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.72) 46%, rgba(0, 0, 0, 0) 74%);
      -webkit-mask-image: radial-gradient(circle at 70% 30%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.72) 46%, rgba(0, 0, 0, 0) 74%);
      mix-blend-mode: overlay;
    }

    &:hover {
      box-shadow: 0 0 0 1px rgba($primary-teal, 0.10), 0 18px 56px rgba(0, 0, 0, 0.34);
      border-color: rgba($primary-gold, 0.28);
      transform: translateY(-3px);
    }

    &:hover::before {
      opacity: 1;
    }

    .featured-image {
      width: 100%;
      height: 120px;
      background: linear-gradient(135deg, rgba($secondary-light-purple, 0.75) 0%, rgba($primary-teal, 0.35) 55%, rgba($primary-gold, 0.70) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        inset: -40% -25% -55% -25%;
        background:
          radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 56%, rgba(255, 255, 255, 0.18) 56.6%, rgba(0, 0, 0, 0) 57.2%),
          radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 70%, rgba($primary-gold, 0.18) 70.7%, rgba(0, 0, 0, 0) 71.4%),
          repeating-conic-gradient(from -90deg, rgba(0, 0, 0, 0) 0deg, rgba(0, 0, 0, 0) 11deg, rgba(255, 255, 255, 0.18) 11.6deg, rgba(0, 0, 0, 0) 12deg),
          repeating-linear-gradient(45deg, rgba($primary-gold, 0.0) 0px, rgba($primary-gold, 0.0) 8px, rgba($primary-gold, 0.06) 9px, rgba($primary-gold, 0.0) 10px);
        opacity: 0.54;
        pointer-events: none;
        mix-blend-mode: overlay;
        filter: drop-shadow(0 0 22px rgba($primary-gold, 0.18));
        mask-image: radial-gradient(circle at 50% 55%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.72) 44%, rgba(0, 0, 0, 0) 70%);
        -webkit-mask-image: radial-gradient(circle at 50% 55%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.72) 44%, rgba(0, 0, 0, 0) 70%);
      }

      .placeholder-image {
        font-size: 2.5rem;
        opacity: 0.5;
      }
    }

    h3 {
      padding: 12px 16px 8px;
      font-size: 0.95rem;
      margin: 0;
    }

    p {
      padding: 0 16px 8px;
      font-size: 0.75rem;
      color: $text-secondary;
      margin: 0;
    }

    .read-more {
      display: inline-block;
      padding: 0 16px 12px;
      color: $primary-gold;
      font-weight: $font-weight-medium;
      font-size: 0.8rem;
      transition: all $transition-base;

      &:hover {
        transform: translateX(5px);
        filter: drop-shadow(0 0 10px rgba($primary-gold, 0.16));
      }
    }
  }
}

// Testimonials Section
.testimonials {
  padding: 40px 0;
  background-color: transparent;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 0.95rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $text-tertiary;
    position: relative;
    display: inline-block;
  }

  h2::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 86px;
    height: 2px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, rgba($secondary-light-purple, 0) 0%, rgba($secondary-light-purple, 0.65) 45%, rgba($primary-gold, 0) 100%);
    filter: drop-shadow(0 0 10px rgba($secondary-light-purple, 0.16));
    opacity: 0.9;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .testimonial-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.022));
    padding: 20px;
    border-radius: $radius-2xl;
    border: 1px solid rgba($primary-gold, 0.14);
    display: flex;
    flex-direction: column;
    gap: 12px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.06), 0 16px 42px rgba(0, 0, 0, 0.26);
    transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(520px 220px at 20% 10%, rgba($secondary-light-purple, 0.08) 0%, rgba($secondary-light-purple, 0) 62%),
        radial-gradient(520px 220px at 85% 85%, rgba($primary-teal, 0.06) 0%, rgba($primary-teal, 0) 62%),
        repeating-conic-gradient(from 190deg, rgba($primary-gold, 0.035) 0deg, rgba($primary-gold, 0.035) 2deg, rgba(0, 0, 0, 0) 11deg, rgba(0, 0, 0, 0) 19deg);
      opacity: 0;
      transition: opacity $transition-base;
      pointer-events: none;
      mix-blend-mode: screen;
      filter: blur(0.25px);
    }

    &::after {
      content: '';
      position: absolute;
      left: -28%;
      bottom: -38%;
      width: 360px;
      height: 360px;
      background:
        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 60%, rgba($primary-gold, 0.075) 60.6%, rgba(0, 0, 0, 0) 61.2%),
        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 76%, rgba($secondary-light-purple, 0.06) 76.6%, rgba(0, 0, 0, 0) 77.2%),
        repeating-conic-gradient(from -90deg, rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0) 13deg, rgba($primary-teal, 0.055) 13.6deg, rgba(255, 255, 255, 0) 14deg),
        repeating-linear-gradient(90deg, rgba($primary-gold, 0) 0px, rgba($primary-gold, 0) 10px, rgba($primary-gold, 0.045) 11px, rgba($primary-gold, 0) 12px);
      opacity: 0.74;
      pointer-events: none;
      mask-image: radial-gradient(circle at 35% 70%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.70) 44%, rgba(0, 0, 0, 0) 74%);
      -webkit-mask-image: radial-gradient(circle at 35% 70%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.70) 44%, rgba(0, 0, 0, 0) 74%);
      mix-blend-mode: overlay;
    }

    &:hover {
      transform: translateY(-3px);
      border-color: rgba($primary-gold, 0.28);
      box-shadow: 0 0 0 1px rgba($primary-teal, 0.10), 0 18px 54px rgba(0, 0, 0, 0.32);
    }

    &:hover::before {
      opacity: 1;
    }

    .stars {
      font-size: 0.85rem;
      letter-spacing: 0.22em;
      opacity: 0.95;
      color: rgba($primary-gold, 0.88);
      text-shadow: 0 0 16px rgba($primary-gold, 0.18);
      position: relative;
      width: fit-content;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -8px;
        height: 2px;
        background: linear-gradient(90deg, rgba($primary-gold, 0) 0%, rgba($primary-gold, 0.42) 42%, rgba($primary-teal, 0.22) 68%, rgba($primary-gold, 0) 100%);
        filter: drop-shadow(0 0 10px rgba($primary-gold, 0.16));
        opacity: 0.75;
      }
    }

    p {
      font-size: 0.8rem;
      line-height: 1.5;
      color: $text-secondary;
      margin: 0;
      flex-grow: 1;
    }

    .testimonial-author {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba($primary-gold, 0.14);

      .author-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background:
          radial-gradient(16px 16px at 30% 28%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 65%),
          radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 58%, rgba($primary-gold, 0.20) 58.8%, rgba(0, 0, 0, 0) 60%),
          linear-gradient(135deg, rgba($secondary-light-purple, 0.12), rgba($primary-teal, 0.08));
        box-shadow: 0 0 0 1px rgba($primary-gold, 0.18), 0 12px 26px rgba(0, 0, 0, 0.24);
        border: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .author-name {
        font-weight: $font-weight-semibold;
        margin: 0;
        color: $text-primary;
        font-size: 0.85rem;
      }

      .author-title {
        font-size: 0.7rem;
        color: $text-tertiary;
        margin: 0;
      }
    }
  }
}

// CTA Section
.cta-section {
  padding: 40px 0;
  background: transparent;
  text-align: center;

  .container {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.022));
    border: 1px solid rgba($primary-gold, 0.16);
    border-radius: $radius-2xl;
    padding: 28px 18px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.06), 0 18px 56px rgba(0, 0, 0, 0.32);
    position: relative;
    overflow: hidden;
  }

  .container::before {
    content: '';
    position: absolute;
    inset: -30%;
    background:
      radial-gradient(700px 360px at 30% 20%, rgba($secondary-light-purple, 0.16) 0%, rgba($secondary-light-purple, 0) 60%),
      radial-gradient(700px 360px at 80% 70%, rgba($primary-teal, 0.12) 0%, rgba($primary-teal, 0) 62%),
      radial-gradient(700px 360px at 50% 90%, rgba($primary-gold, 0.10) 0%, rgba($primary-gold, 0) 62%);
    opacity: 0.9;
    pointer-events: none;
  }

  .container > * {
    position: relative;
    z-index: 1;
  }

  h2 {
    font-size: 1.05rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 12px;
    color: $text-primary;
  }

  p {
    font-size: 0.9rem;
    margin-bottom: 24px;
    color: $text-secondary;
  }

  .btn {
    padding: 12px 32px;
    font-size: 0.95rem;
    border-radius: 999px;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.06);
    color: $text-primary;
    border: 1px solid rgba($primary-gold, 0.16);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 0 0 1px rgba($secondary-light-purple, 0.06);
    transition: transform $transition-base, box-shadow $transition-base, border-color $transition-base, filter $transition-base, background $transition-base;
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background: radial-gradient(260px 140px at 30% 30%, rgba($primary-teal, 0.18) 0%, rgba($primary-teal, 0) 70%);
    transition: opacity $transition-base;
    pointer-events: none;
  }

  .btn:hover {
    transform: translateY(-1px);
    border-color: rgba($primary-gold, 0.28);
    box-shadow: 0 0 0 1px rgba($primary-teal, 0.10), 0 18px 54px rgba(0, 0, 0, 0.28);
  }

  .btn:hover::before {
    opacity: 1;
  }

  .btn:active {
    transform: translateY(0px);
  }

  .btn.btn-primary {
    background: linear-gradient(135deg, rgba($secondary-light-purple, 0.92) 0%, rgba($primary-teal, 0.70) 55%, rgba($primary-gold, 0.92) 100%);
    color: $neutral-black;
    border: 1px solid rgba($primary-gold, 0.22);
    box-shadow: 0 0 0 1px rgba($primary-gold, 0.18), 0 18px 46px rgba(0, 0, 0, 0.22);
  }

  .btn.btn-primary:hover {
    filter: brightness(1.02) saturate(1.08);
    box-shadow: 0 0 0 1px rgba($primary-gold, 0.26), 0 22px 56px rgba(0, 0, 0, 0.28);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .hero-title {
    font-size: 1.3rem;
  }

  .quick-access .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured .featured-grid,
  .testimonials .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 30px 0;
  }

  .hero-title {
    font-size: 1.2rem;
  }

  .hero-subtitle {
    font-size: 0.85rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: flex-start;

    .btn {
      width: 100%;
      text-align: center;
    }
  }

  .quick-access,
  .featured,
  .testimonials,
  .cta-section {
    padding: 30px 0;
  }

  .quick-access h2,
  .featured h2,
  .testimonials h2,
  .cta-section h2 {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }

  .quick-access .card-grid {
    grid-template-columns: 1fr;
  }

  .featured .featured-grid,
  .testimonials .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .featured-card .featured-image {
    height: 100px;
  }

  .cta-section p {
    font-size: 0.85rem;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 20px 0;

    &::before {
      width: 250px;
      height: 250px;
      top: -30%;
      right: -20%;
    }
  }

  .hero-title {
    font-size: 1rem;
  }

  .hero-subtitle {
    font-size: 0.8rem;
  }

  .quick-access,
  .featured,
  .testimonials,
  .cta-section {
    padding: 20px 0;
  }

  .quick-access h2,
  .featured h2,
  .testimonials h2,
  .cta-section h2 {
    font-size: 1rem;
    margin-bottom: 16px;
  }

  .quick-card {
    padding: 16px 12px;
  }

  .featured-card h3,
  .testimonial-card {
    padding: 12px;
  }

  .cta-section p {
    font-size: 0.8rem;
  }
}
</style>
