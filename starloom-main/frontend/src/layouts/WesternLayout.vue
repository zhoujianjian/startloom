<template>
  <div class="western-layout">
    <div class="western-bg" aria-hidden="true">
      <div class="western-bg__nebula"></div>
      <div class="western-bg__aurora"></div>
      <div class="western-bg__stars"></div>
      <div class="western-bg__constellations"></div>
      <div class="western-bg__wheel"></div>
      <div class="western-bg__glyphs"></div>
      <div class="western-bg__grid"></div>
      <div class="western-bg__shooting"></div>
      <div class="western-bg__glow"></div>
      <div class="western-bg__scanlines"></div>
      <div class="western-bg__frame"></div>
      <div class="western-bg__vignette"></div>
      <div class="western-bg__grain"></div>
    </div>
    <!-- 西方版本头部 -->
    <WesternHeader />

    <!-- 主内容区域 -->
    <main class="western-main">
      <router-view />
    </main>

    <!-- 西方版本底部 -->
    <WesternFooter />
  </div>
</template>

<script>
import WesternHeader from '../components/Western/WesternHeader.vue'
import WesternFooter from '../components/Western/WesternFooter.vue'
import { trackPV, startHeartbeat, stopHeartbeat, trackToolOpen } from '../utils/analytics'

export default {
  name: 'WesternLayout',
  components: {
    WesternHeader,
    WesternFooter
  },
  data() {
    return {
      _parallaxEnabled: false,
      _onMove: null,
      _onLeave: null,
    }
  },
  methods: {
    trackRoute(route) {
      trackPV()

      const path = route?.path || ''
      let toolId = null

      if (path.startsWith('/en/tarot')) toolId = 'tarot'
      else if (path.startsWith('/en/compatibility')) toolId = 'compatibility'
      else if (path.startsWith('/en/horoscope')) toolId = 'horoscope'
      else if (path.startsWith('/en/astrology')) toolId = 'astrology'
      else if (path.startsWith('/en/numerology')) toolId = 'numerology'
      else if (path.startsWith('/en/tools')) toolId = 'western_tools'

      if (toolId) trackToolOpen(toolId)
    }
  },
  watch: {
    $route(to) {
      this.trackRoute(to)
    }
  },
  mounted() {
    startHeartbeat()
    this.trackRoute(this.$route)

    // 背景视差：仅在具备精细指针（鼠标/触控板）时启用，避免移动端耗电/卡顿
    try {
      const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches
      const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches
      this._parallaxEnabled = Boolean(canHover && finePointer)
    } catch (e) {
      this._parallaxEnabled = false
    }

    if (this._parallaxEnabled) {
      const el = this.$el
      const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
      this._onMove = (ev) => {
        const w = window.innerWidth || 1
        const h = window.innerHeight || 1
        const nx = clamp((ev.clientX / w) * 2 - 1, -1, 1)
        const ny = clamp((ev.clientY / h) * 2 - 1, -1, 1)
        el.style.setProperty('--mx', String(nx))
        el.style.setProperty('--my', String(ny))
      }
      this._onLeave = () => {
        el.style.setProperty('--mx', '0')
        el.style.setProperty('--my', '0')
      }
      window.addEventListener('mousemove', this._onMove, { passive: true })
      window.addEventListener('mouseleave', this._onLeave, { passive: true })
    }
  },
  beforeUnmount() {
    stopHeartbeat()

    if (this._onMove) window.removeEventListener('mousemove', this._onMove)
    if (this._onLeave) window.removeEventListener('mouseleave', this._onLeave)
  }
}
</script>

<style scoped lang="scss">
@import '../assets/styles/western-variables.scss';

.western-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-primary;
  color: $text-primary;
  position: relative;
  overflow: hidden;
  --mx: 0;
  --my: 0;
}

.western-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.western-bg__nebula {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(800px 500px at 20% 18%, rgba($secondary-light-purple, 0.24) 0%, rgba($secondary-light-purple, 0) 62%),
    radial-gradient(700px 500px at 85% 30%, rgba($primary-teal, 0.16) 0%, rgba($primary-teal, 0) 60%),
    radial-gradient(900px 650px at 55% 85%, rgba($primary-gold, 0.10) 0%, rgba($primary-gold, 0) 58%),
    linear-gradient(180deg, $primary-navy 0%, $secondary-dark-navy 100%);
  filter: saturate(1.2) contrast(1.04);
  animation: nebulaFloat 18s ease-in-out infinite;
  transform: translateZ(0);
}

.western-bg__aurora {
  position: absolute;
  inset: -30%;
  background:
    conic-gradient(from 210deg at 50% 50%,
      rgba($secondary-light-purple, 0.12),
      rgba($primary-teal, 0.10),
      rgba($primary-gold, 0.10),
      rgba($secondary-light-purple, 0.12)
    );
  mix-blend-mode: screen;
  filter: blur(24px);
  opacity: 0.85;
  animation: auroraSpin 22s linear infinite;
  transform: translateZ(0);
}

.western-bg__stars {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1px 1px at 12% 18%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 60%),
    radial-gradient(1px 1px at 62% 36%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 60%),
    radial-gradient(1.5px 1.5px at 28% 72%, rgba($primary-gold, 0.55) 0%, rgba($primary-gold, 0) 65%),
    radial-gradient(1px 1px at 84% 64%, rgba($primary-teal, 0.45) 0%, rgba($primary-teal, 0) 65%),
    radial-gradient(1px 1px at 44% 52%, rgba($secondary-light-purple, 0.5) 0%, rgba($secondary-light-purple, 0) 70%);
  opacity: 0.55;
  animation: starsDrift 26s linear infinite;
  transform: translate3d(calc(var(--mx) * -6px), calc(var(--my) * -6px), 0);
}

.western-bg__stars::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1px 1px at 18% 48%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 60%),
    radial-gradient(1px 1px at 72% 18%, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 60%),
    radial-gradient(1.5px 1.5px at 90% 34%, rgba($primary-gold, 0.40) 0%, rgba($primary-gold, 0) 70%),
    radial-gradient(1px 1px at 38% 88%, rgba($secondary-light-purple, 0.55) 0%, rgba($secondary-light-purple, 0) 70%);
  opacity: 0.55;
  animation: starsTwinkle 4.8s ease-in-out infinite;
}

.western-bg__constellations {
  position: absolute;
  inset: 0;
  opacity: 0.52;
  transform: translate3d(calc(var(--mx) * -10px), calc(var(--my) * -8px), 0);
  mix-blend-mode: screen;
}

.western-bg__constellations::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(2px 2px at 12% 22%, rgba($primary-gold, 0.55) 0%, rgba($primary-gold, 0) 65%),
    radial-gradient(2px 2px at 24% 44%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 65%),
    radial-gradient(2px 2px at 36% 30%, rgba($primary-teal, 0.40) 0%, rgba($primary-teal, 0) 65%),
    radial-gradient(2px 2px at 48% 18%, rgba($secondary-light-purple, 0.42) 0%, rgba($secondary-light-purple, 0) 65%),
    radial-gradient(2px 2px at 58% 38%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0) 65%),
    radial-gradient(2px 2px at 66% 24%, rgba($primary-gold, 0.45) 0%, rgba($primary-gold, 0) 65%),
    radial-gradient(2px 2px at 74% 46%, rgba($primary-teal, 0.38) 0%, rgba($primary-teal, 0) 65%),
    radial-gradient(2px 2px at 84% 20%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 65%),
    radial-gradient(2px 2px at 88% 52%, rgba($secondary-light-purple, 0.38) 0%, rgba($secondary-light-purple, 0) 65%);
  filter: drop-shadow(0 0 14px rgba($primary-teal, 0.14)) drop-shadow(0 0 14px rgba($secondary-light-purple, 0.10));
  opacity: 0.72;
}

.western-bg__constellations::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.55;
  background:
    linear-gradient(115deg, rgba($primary-teal, 0) 0%, rgba($primary-teal, 0.24) 48%, rgba($primary-teal, 0) 100%) 12% 22% / 320px 2px no-repeat,
    linear-gradient(32deg, rgba($primary-teal, 0) 0%, rgba($primary-teal, 0.24) 50%, rgba($primary-teal, 0) 100%) 24% 44% / 340px 2px no-repeat,
    linear-gradient(160deg, rgba($secondary-light-purple, 0) 0%, rgba($secondary-light-purple, 0.22) 50%, rgba($secondary-light-purple, 0) 100%) 36% 30% / 280px 2px no-repeat,
    linear-gradient(90deg, rgba($primary-gold, 0) 0%, rgba($primary-gold, 0.18) 50%, rgba($primary-gold, 0) 100%) 58% 38% / 260px 2px no-repeat,
    linear-gradient(28deg, rgba($secondary-light-purple, 0) 0%, rgba($secondary-light-purple, 0.20) 50%, rgba($secondary-light-purple, 0) 100%) 74% 46% / 300px 2px no-repeat;
  filter: blur(0.35px) drop-shadow(0 0 12px rgba($primary-teal, 0.10));
  animation: constellationDrift 26s ease-in-out infinite;
}

.western-bg__wheel {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.24;
  mix-blend-mode: screen;
  transform: translate3d(calc(var(--mx) * 6px), calc(var(--my) * 4px), 0);
}

.western-bg__wheel::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 44%;
  width: min(1100px, 120vw);
  height: min(1100px, 120vw);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 56%, rgba($primary-gold, 0.10) 56.4%, rgba(0, 0, 0, 0) 57%),
    radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 66%, rgba($secondary-light-purple, 0.10) 66.4%, rgba(0, 0, 0, 0) 67%),
    radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 78%, rgba($primary-teal, 0.08) 78.4%, rgba(0, 0, 0, 0) 79%),
    repeating-conic-gradient(
      from -90deg,
      rgba(255, 255, 255, 0) 0deg,
      rgba(255, 255, 255, 0) 11deg,
      rgba($primary-gold, 0.12) 11.4deg,
      rgba(255, 255, 255, 0) 12deg
    );
  mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 46%, rgba(0, 0, 0, 1) 52%, rgba(0, 0, 0, 1) 92%, rgba(0, 0, 0, 0) 100%);
  filter: blur(0.25px) drop-shadow(0 0 20px rgba($primary-gold, 0.08));
  opacity: 0.95;
  animation: wheelRotate 80s linear infinite;
}

.western-bg__wheel::after {
  content: '';
  position: absolute;
  left: 72%;
  top: 36%;
  width: 520px;
  height: 520px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 60%, rgba($secondary-light-purple, 0.10) 60.4%, rgba(0, 0, 0, 0) 61%),
    repeating-conic-gradient(
      from 0deg,
      rgba(255, 255, 255, 0) 0deg,
      rgba(255, 255, 255, 0) 23deg,
      rgba($primary-teal, 0.10) 23.5deg,
      rgba(255, 255, 255, 0) 24deg
    );
  mask-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 1) 46%, rgba(0, 0, 0, 1) 92%, rgba(0, 0, 0, 0) 100%);
  filter: blur(0.3px);
  opacity: 0.55;
  animation: wheelRotate 120s linear infinite reverse;
}

.western-bg__glyphs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.14;
  mix-blend-mode: soft-light;
  transform: translate3d(calc(var(--mx) * -4px), calc(var(--my) * -3px), 0);
}

.western-bg__glyphs::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Crect width='240' height='240' fill='none'/%3E%3Cg fill='rgba(231,196,138,0.55)' font-family='serif' font-size='22'%3E%3Ctext x='22' y='44'%3E%E2%99%88%3C/text%3E%3Ctext x='188' y='64'%3E%E2%99%89%3C/text%3E%3Ctext x='140' y='118'%3E%E2%99%8A%3C/text%3E%3Ctext x='26' y='130'%3E%E2%99%8B%3C/text%3E%3Ctext x='188' y='166'%3E%E2%99%8C%3C/text%3E%3Ctext x='110' y='212'%3E%E2%99%8D%3C/text%3E%3C/g%3E%3Cg fill='rgba(167,139,250,0.45)' font-family='serif' font-size='20'%3E%3Ctext x='78' y='72'%3E%E2%99%8E%3C/text%3E%3Ctext x='154' y='92'%3E%E2%99%8F%3C/text%3E%3Ctext x='70' y='164'%3E%E2%99%90%3C/text%3E%3Ctext x='150' y='204'%3E%E2%99%91%3C/text%3E%3C/g%3E%3Cg fill='rgba(45,226,230,0.32)' font-family='serif' font-size='18'%3E%3Ctext x='120' y='46'%3E%E2%99%92%3C/text%3E%3Ctext x='44' y='204'%3E%E2%99%93%3C/text%3E%3C/g%3E%3C/svg%3E");
  background-size: 280px 280px;
  background-position: 0 0;
  filter: blur(0.3px);
  mask-image: radial-gradient(circle at 50% 42%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 62%, rgba(0, 0, 0, 0.15) 78%, rgba(0, 0, 0, 0) 100%);
}

.western-bg__glyphs::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(520px 360px at 50% 20%, rgba(231, 196, 138, 0.08) 0%, rgba(231, 196, 138, 0) 70%);
  opacity: 0.55;
  mix-blend-mode: screen;
}

.western-bg__grid {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  transform-origin: 50% 70%;
  transform: perspective(900px) rotateX(62deg) translateY(18%) translate3d(calc(var(--mx) * 10px), calc(var(--my) * 6px), 0);
  background:
    linear-gradient(to right, rgba($primary-teal, 0.22) 1px, transparent 1px),
    linear-gradient(to bottom, rgba($secondary-light-purple, 0.22) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at 50% 85%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 66%);
  animation: gridScroll 14s linear infinite;
  filter: drop-shadow(0 0 10px rgba($primary-teal, 0.18));
}

.western-bg__shooting {
  position: absolute;
  inset: 0;
  opacity: 0.55;
}

.western-bg__shooting::before,
.western-bg__shooting::after {
  content: '';
  position: absolute;
  width: 260px;
  height: 2px;
  background: linear-gradient(90deg, rgba($primary-gold, 0) 0%, rgba($primary-gold, 0.9) 45%, rgba($secondary-light-purple, 0) 100%);
  border-radius: 999px;
  filter: blur(0.4px);
  transform: rotate(-22deg);
  animation: shootingStar 7.8s ease-in-out infinite;
}

.western-bg__shooting::before {
  top: 18%;
  left: -40%;
  animation-delay: 0.6s;
}

.western-bg__shooting::after {
  top: 54%;
  left: -55%;
  width: 340px;
  height: 2px;
  background: linear-gradient(90deg, rgba($primary-teal, 0) 0%, rgba($primary-teal, 0.85) 45%, rgba($primary-gold, 0) 100%);
  animation-delay: 3.2s;
}

.western-bg__glow {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(520px 380px at calc(50% + var(--mx) * 18%) calc(50% + var(--my) * 14%), rgba($primary-teal, 0.18) 0%, rgba($primary-teal, 0) 60%),
    radial-gradient(620px 420px at calc(55% + var(--mx) * -12%) calc(35% + var(--my) * -10%), rgba($secondary-light-purple, 0.18) 0%, rgba($secondary-light-purple, 0) 62%),
    radial-gradient(520px 380px at calc(40% + var(--mx) * 10%) calc(75% + var(--my) * 12%), rgba($primary-gold, 0.12) 0%, rgba($primary-gold, 0) 60%);
  filter: blur(6px) saturate(1.15);
  opacity: 0.9;
  mix-blend-mode: screen;
  transform: translateZ(0);
}

.western-bg__scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.14;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.06) 0px,
      rgba(255, 255, 255, 0.06) 1px,
      rgba(0, 0, 0, 0) 3px,
      rgba(0, 0, 0, 0) 6px
    );
  mix-blend-mode: overlay;
  animation: scanDrift 10s linear infinite;
}

.western-bg__scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba($secondary-light-purple, 0.0) 0%, rgba($secondary-light-purple, 0.18) 50%, rgba($secondary-light-purple, 0.0) 100%);
  opacity: 0.16;
  transform: translateX(-120%);
  animation: glitchSweep 14s linear infinite;
  filter: blur(1.2px);
}

.western-bg__frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.western-bg__frame::before {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 18px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba($secondary-light-purple, 0.95) 0%,
    rgba($primary-teal, 0.85) 45%,
    rgba($primary-gold, 0.92) 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.22;
  filter: blur(0.4px) drop-shadow(0 0 18px rgba($secondary-light-purple, 0.18));
  animation: framePulse 6.5s ease-in-out infinite;
  mix-blend-mode: screen;
}

.western-bg__frame::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 22px;
  background:
    radial-gradient(320px 220px at calc(15% + var(--mx) * 8%) calc(12% + var(--my) * 6%), rgba($secondary-light-purple, 0.12) 0%, rgba($secondary-light-purple, 0) 70%),
    radial-gradient(340px 240px at calc(86% + var(--mx) * -8%) calc(78% + var(--my) * -6%), rgba($primary-teal, 0.10) 0%, rgba($primary-teal, 0) 70%),
    radial-gradient(360px 260px at 50% 92%, rgba($primary-gold, 0.08) 0%, rgba($primary-gold, 0) 70%);
  opacity: 0.42;
  mix-blend-mode: screen;
  animation: frameFlicker 18s ease-in-out infinite;
}

.western-bg__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 40%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.45) 68%, rgba(0, 0, 0, 0.70) 100%),
    radial-gradient(900px 600px at 50% 50%, rgba($primary-navy, 0) 0%, rgba($primary-navy, 0.35) 70%, rgba($primary-navy, 0.65) 100%);
  opacity: 0.95;
}

.western-bg__grain {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.06) 1px, transparent 0);
  background-size: 3px 3px;
  opacity: 0.06;
  filter: blur(0.2px);
  animation: grainShift 10s steps(8) infinite;
}

.western-main {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  
  // 自定义滚动条
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($primary-gold, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-gold;
    border-radius: 4px;

    &:hover {
      background: $secondary-light-gold;
    }
  }
}

@keyframes nebulaFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(-1.5%, 1.2%, 0) scale(1.03);
  }
}

@keyframes auroraSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes grainShift {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-2%, 1.5%, 0);
  }
}

@keyframes starsDrift {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-2%, 1.5%, 0);
  }
}

@keyframes starsTwinkle {
  0%, 100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.75;
  }
}

@keyframes constellationDrift {
  0%, 100% {
    transform: translate3d(0, 0, 0);
    opacity: 0.36;
  }
  50% {
    transform: translate3d(-0.8%, 0.6%, 0);
    opacity: 0.52;
  }
}

@keyframes wheelRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes gridScroll {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 72px;
  }
}

@keyframes shootingStar {
  0% {
    transform: translate3d(0, 0, 0) rotate(-22deg);
    opacity: 0;
  }
  10% {
    opacity: 0.85;
  }
  55% {
    opacity: 0;
  }
  100% {
    transform: translate3d(160vw, 30vh, 0) rotate(-22deg);
    opacity: 0;
  }
}

@keyframes scanDrift {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(24px);
  }
}

@keyframes glitchSweep {
  0% {
    transform: translateX(-120%) skewX(0deg);
  }
  10% {
    transform: translateX(0%) skewX(-3deg);
  }
  16% {
    transform: translateX(120%) skewX(3deg);
  }
  100% {
    transform: translateX(120%) skewX(3deg);
  }
}

@keyframes framePulse {
  0%, 100% {
    opacity: 0.16;
    transform: scale(1);
  }
  55% {
    opacity: 0.30;
    transform: scale(1.004);
  }
}

@keyframes frameFlicker {
  0% {
    opacity: 0.34;
    filter: saturate(1.08);
  }
  45% {
    opacity: 0.44;
  }
  55% {
    opacity: 0.32;
  }
  70% {
    opacity: 0.46;
  }
  100% {
    opacity: 0.34;
    filter: saturate(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .western-bg__nebula,
  .western-bg__aurora,
  .western-bg__stars,
  .western-bg__constellations::after,
  .western-bg__wheel::before,
  .western-bg__wheel::after,
  .western-bg__grid,
  .western-bg__shooting::before,
  .western-bg__shooting::after,
  .western-bg__scanlines,
  .western-bg__scanlines::after,
  .western-bg__grain,
  .western-bg__frame::before,
  .western-bg__frame::after {
    animation: none !important;
  }
}
</style>
