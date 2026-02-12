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
  background-color: $bg-primary;
  color: $text-primary;
}

.popular {
  padding: 26px 0 10px;

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

// Hero Section
.hero {
  padding: 40px 0;
  background: linear-gradient(135deg, $primary-navy 0%, $secondary-dark-navy 100%);
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
    font-size: 1.5rem;
    font-family: $font-family-display;
    background: $gradient-purple-gold;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 0.9rem;
    color: $text-secondary;
    line-height: 1.6;
  }

  .hero-buttons {
    display: flex;
    gap: 12px;
    align-items: center;

    .btn {
      padding: 10px 24px;
      font-size: 0.9rem;
    }
  }

  .hero-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    position: relative;
  }

  .mystical-circle {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: $gradient-purple-gold;
    opacity: 0.15;
    animation: float 6s ease-in-out infinite;
  }

  .mystical-circle-2 {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: $gradient-teal-purple;
    opacity: 0.1;
    animation: float 8s ease-in-out infinite reverse;
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

// Quick Access Cards
.quick-access {
  padding: 40px 0;
  background-color: $bg-primary;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.3rem;
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
    background-color: $bg-secondary;
    border-radius: $radius-2xl;
    border: 2px solid rgba($primary-gold, 0.1);
    transition: all $transition-base;
    text-decoration: none;
    color: inherit;
    cursor: pointer;

    &:hover {
      border-color: $primary-gold;
      box-shadow: 0 0 30px rgba($primary-gold, 0.2);
      transform: translateY(-5px);
    }

    .card-icon {
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: rgba($primary-gold, 0.1);
      border-radius: $radius-xl;
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
  background-color: $bg-secondary;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.3rem;
  }

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .featured-card {
    background-color: $bg-primary;
    border-radius: $radius-2xl;
    overflow: hidden;
    transition: all $transition-base;
    border: 1px solid rgba($primary-gold, 0.1);

    &:hover {
      box-shadow: $shadow-xl;
      border-color: $primary-gold;
    }

    .featured-image {
      width: 100%;
      height: 120px;
      background: $gradient-purple-gold;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

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
      }
    }
  }
}

// Testimonials Section
.testimonials {
  padding: 40px 0;
  background-color: $bg-primary;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 1.3rem;
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .testimonial-card {
    background-color: $bg-secondary;
    padding: 20px;
    border-radius: $radius-2xl;
    border: 1px solid rgba($primary-gold, 0.1);
    display: flex;
    flex-direction: column;
    gap: 12px;

    .stars {
      font-size: 0.9rem;
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
      border-top: 1px solid rgba($primary-gold, 0.1);

      .author-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba($primary-gold, 0.1);
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
  background: $gradient-purple-gold;
  text-align: center;

  h2 {
    font-size: 1.3rem;
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
