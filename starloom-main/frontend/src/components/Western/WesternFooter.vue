<template>
  <footer class="western-footer">
    <div class="container">
      <div class="footer-content">
        <!-- About Section -->
        <div class="footer-section">
          <div class="section-header">
            <h4>✨ StarLoom</h4>
          </div>
          <p>Discover your cosmic destiny through AI-powered tarot readings, astrology charts, and numerology guidance.</p>
          <div class="social-links">
            <a href="#" class="social-link" title="Facebook" aria-label="Facebook">f</a>
            <a href="#" class="social-link" title="Twitter" aria-label="Twitter">𝕏</a>
            <a href="#" class="social-link" title="Instagram" aria-label="Instagram">📷</a>
            <a href="#" class="social-link" title="YouTube" aria-label="YouTube">▶</a>
          </div>
        </div>

        <!-- Services -->
        <div class="footer-section">
          <div class="section-header">
            <h4>Services</h4>
          </div>
          <ul>
            <li><router-link to="/en/tarot">Tarot Reading</router-link></li>
            <li><router-link to="/en/astrology">Astrology</router-link></li>
            <li><router-link to="/en/horoscope">Horoscope</router-link></li>
            <li><router-link to="/en/numerology">Numerology</router-link></li>
            <li><router-link to="/en/tools">Spiritual Tools</router-link></li>
            <li><router-link to="/en/ai">AI Guide</router-link></li>
          </ul>
        </div>

        <!-- Resources -->
        <div class="footer-section">
          <div class="section-header">
            <h4>Resources</h4>
          </div>
          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Learning Center</a></li>
            <li><a href="#">FAQ</a></li>
            <li><router-link to="/en/contact">Contact Us</router-link></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Affiliate Program</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="footer-section">
          <div class="section-header">
            <h4>Legal</h4>
          </div>
          <ul>
            <li><router-link to="/en/privacy-policy">Privacy Policy</router-link></li>
            <li><router-link to="/en/terms">Terms of Service</router-link></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Disclaimer</a></li>
            <li><a href="#">GDPR</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p>&copy; 2026 StarLoom. All rights reserved. | Unlock Your Cosmic Destiny</p>
        <div class="footer-badges">
          <span class="badge">🔒 Secure</span>
          <span class="badge">✓ Verified</span>
          <span class="badge">🌍 Global</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'WesternFooter'
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/western-variables.scss';

.western-footer {
  background: linear-gradient(135deg, $bg-secondary 0%, rgba($primary-purple, 0.1) 100%);
  border-top: 2px solid rgba($primary-gold, 0.2);
  padding: 60px 0 20px;
  margin-top: 80px;

  .container {
    padding: 0 $spacing-lg;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    margin-bottom: 40px;
  }

  .footer-section {
    .section-header {
      margin-bottom: 20px;

      h4 {
        font-size: 1.125rem;
        font-weight: $font-weight-bold;
        margin: 0;
        background: $gradient-purple-gold;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    p {
      font-size: 0.875rem;
      color: $text-secondary;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 12px;

        a {
          color: $text-secondary;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all $transition-base;
          display: inline-block;

          &:hover {
            color: $primary-gold;
            transform: translateX(4px);
          }
        }
      }
    }

    .social-links {
      display: flex;
      gap: 16px;

      .social-link {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba($primary-gold, 0.15) 0%, rgba($primary-purple, 0.1) 100%);
        border: 1px solid rgba($primary-gold, 0.2);
        border-radius: $radius-lg;
        color: $primary-gold;
        text-decoration: none;
        transition: all $transition-base;
        font-weight: $font-weight-bold;

        &:hover {
          background: $gradient-purple-gold;
          color: $bg-primary;
          transform: translateY(-3px);
          box-shadow: $shadow-lg;
        }
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba($primary-gold, 0.1);
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      font-size: 0.75rem;
      color: $text-tertiary;
      margin: 0;
    }

    .footer-badges {
      display: flex;
      gap: 16px;

      .badge {
        font-size: 0.75rem;
        color: $text-tertiary;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px;
        background: rgba($primary-gold, 0.05);
        border-radius: $radius-md;
        border: 1px solid rgba($primary-gold, 0.1);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .western-footer {
    .footer-content {
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
    }
  }
}

@media (max-width: 768px) {
  .western-footer {
    padding: 40px 0 20px;
    margin-top: 60px;

    .footer-content {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 16px;
      text-align: center;

      p {
        font-size: 0.7rem;
      }

      .footer-badges {
        justify-content: center;
      }
    }
  }
}

@media (max-width: 640px) {
  .western-footer {
    padding: 30px 0 15px;

    .footer-section {
      .section-header h4 {
        font-size: 1rem;
      }

      p {
        font-size: 0.8rem;
      }

      ul li a {
        font-size: 0.8rem;
      }

      .social-links {
        gap: 12px;

        .social-link {
          width: 36px;
          height: 36px;
          font-size: 0.875rem;
        }
      }
    }

    .footer-bottom {
      p {
        font-size: 0.65rem;
      }

      .footer-badges {
        gap: 8px;

        .badge {
          font-size: 0.65rem;
          padding: 3px 8px;
        }
      }
    }
  }
}
</style>
