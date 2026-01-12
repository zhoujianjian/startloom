<template>
  <div class="brand-showcase">
    <!-- 核心数据统计 -->
    <div class="stats-section">
      <div class="section-title">
        <span class="icon">✧</span>
        <span>{{ $t('brandTitle') || '天机AI · 命理大数据' }}</span>
        <span class="icon">✧</span>
      </div>
      <div class="stats-grid">
        <div class="stat-item" v-for="(stat, index) in stats" :key="index">
          <div class="stat-number">
            <span class="number" ref="numbers">{{ stat.displayValue }}</span>
            <span class="unit">{{ stat.unit }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- 核心优势 -->
    <div class="advantages-section">
      <div class="section-title">
        <span class="icon">☆</span>
        <span>{{ $t('whyChooseUs') || '为什么选择天机AI' }}</span>
        <span class="icon">☆</span>
      </div>
      <div class="advantages-grid">
        <div class="advantage-item" v-for="(adv, index) in advantages" :key="index">
          <div class="adv-icon">{{ adv.icon }}</div>
          <div class="adv-title">{{ adv.title }}</div>
          <div class="adv-desc">{{ adv.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 用户评价/成功案例 -->
    <div class="testimonials-section">
      <div class="section-title">
        <span class="icon">★</span>
        <span>{{ $t('userTestimonials') || '用户真实反馈' }}</span>
        <span class="icon">★</span>
      </div>
      <div class="testimonials-carousel">
        <div class="testimonial-card" v-for="(item, index) in testimonials" :key="index" 
             :class="{ active: currentTestimonial === index }">
          <div class="quote-icon">"</div>
          <div class="testimonial-content">{{ item.content }}</div>
          <div class="testimonial-footer">
            <div class="user-avatar">{{ item.avatar }}</div>
            <div class="user-info">
              <div class="user-name">{{ item.name }}</div>
              <div class="user-tag">{{ item.tag }}</div>
            </div>
            <div class="rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= item.rating }">★</span>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-dots">
        <span v-for="(_, index) in testimonials" :key="index" 
              class="dot" :class="{ active: currentTestimonial === index }"
              @click="currentTestimonial = index"></span>
      </div>
    </div>

    <!-- 权威认证 -->
    <div class="certifications">
      <div class="cert-item" v-for="(cert, index) in certifications" :key="index">
        <span class="cert-icon">{{ cert.icon }}</span>
        <span class="cert-text">{{ cert.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'BrandShowcase',
  setup() {
    const currentTestimonial = ref(0)
    let autoPlayTimer = null

    // 核心数据统计
    const stats = ref([
      { value: 1280, displayValue: '0', unit: '万+', label: '命理数据样本' },
      { value: 368, displayValue: '0', unit: '万+', label: '服务用户数' },
      { value: 98.6, displayValue: '0', unit: '%', label: '用户满意度' },
      { value: 15, displayValue: '0', unit: '年+', label: '命理研究积累' }
    ])

    // 核心优势
    const advantages = ref([
      {
        icon: '🔮',
        title: '千年命理 × AI智能',
        desc: '融合周易、紫微斗数、八字命理等传统智慧，结合现代AI深度学习'
      },
      {
        icon: '📊',
        title: '海量真实案例',
        desc: '基于1280万+真实命理案例训练，准确率远超普通AI'
      },
      {
        icon: '🎯',
        title: '个性化精准解读',
        desc: '不是模板回复，根据您的具体信息进行深度个性化分析'
      },
      {
        icon: '🔒',
        title: '隐私安全保障',
        desc: '数据加密存储，绝不泄露您的任何个人信息'
      }
    ])

    // 用户评价
    const testimonials = ref([
      {
        content: '之前用过很多AI问命理，回答都很敷衍。天机AI的分析真的很专业，把我的性格特点说得太准了，连我自己都没意识到的问题都点出来了！',
        name: '张女士',
        avatar: '👩',
        tag: '北京 · 产品经理',
        rating: 5
      },
      {
        content: '本来抱着试试看的心态，结果关于事业的建议真的帮到我了。去年按照建议换了工作方向，现在收入翻了一倍！',
        name: '李先生',
        avatar: '👨',
        tag: '深圳 · 创业者',
        rating: 5
      },
      {
        content: '感情方面一直不顺，天机AI分析了我的八字后给出的建议很中肯，现在终于找到对的人了，感谢！',
        name: '王小姐',
        avatar: '👧',
        tag: '上海 · 设计师',
        rating: 5
      },
      {
        content: '作为一个理工男，本来不信这些。但天机AI的分析逻辑清晰，有理有据，让我对命理学有了新的认识。',
        name: '陈先生',
        avatar: '🧑',
        tag: '杭州 · 程序员',
        rating: 4
      }
    ])

    // 权威认证
    const certifications = ref([
      { icon: '🏆', text: '中国传统文化数字化创新奖' },
      { icon: '✅', text: '国家信息安全等级保护认证' },
      { icon: '📜', text: '易学研究协会技术合作单位' }
    ])

    // 数字动画
    const animateNumbers = () => {
      stats.value.forEach((stat, index) => {
        let current = 0
        const target = stat.value
        const duration = 2000
        const step = target / (duration / 16)
        
        const timer = setInterval(() => {
          current += step
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          stats.value[index].displayValue = current % 1 === 0 
            ? Math.floor(current).toString() 
            : current.toFixed(1)
        }, 16)
      })
    }

    // 自动轮播
    const startAutoPlay = () => {
      autoPlayTimer = setInterval(() => {
        currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.value.length
      }, 5000)
    }

    onMounted(() => {
      animateNumbers()
      startAutoPlay()
    })

    onUnmounted(() => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
      }
    })

    return {
      stats,
      advantages,
      testimonials,
      certifications,
      currentTestimonial
    }
  }
}
</script>

<style scoped lang="scss">
.brand-showcase {
  padding: 0.4rem;
  color: #f8f4ff;
  
  .section-title {
    text-align: center;
    font-size: 0.4rem;
    font-family: Alimama-DongFangDaKai;
    margin-bottom: 0.4rem;
    color: #F5D547;
    text-shadow: 0 0 20px rgba(245, 213, 71, 0.5);
    
    .icon {
      margin: 0 0.2rem;
      animation: twinkle 2s infinite;
    }
  }
}

// 数据统计
.stats-section {
  margin-bottom: 0.6rem;
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.3rem;
    
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .stat-item {
    text-align: center;
    padding: 0.3rem;
    background: linear-gradient(135deg, rgba(123, 92, 245, 0.15) 0%, rgba(157, 78, 221, 0.1) 100%);
    border: 1px solid rgba(123, 92, 245, 0.3);
    border-radius: 0.2rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(123, 92, 245, 0.3);
      border-color: rgba(245, 213, 71, 0.5);
    }
    
    .stat-number {
      .number {
        font-size: 0.6rem;
        font-weight: bold;
        background: linear-gradient(135deg, #F5D547 0%, #C9A227 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .unit {
        font-size: 0.3rem;
        color: #F5D547;
      }
    }
    
    .stat-label {
      font-size: 0.28rem;
      color: rgba(248, 244, 255, 0.8);
      margin-top: 0.1rem;
    }
  }
}

// 核心优势
.advantages-section {
  margin-bottom: 0.6rem;
  
  .advantages-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.3rem;
    
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .advantage-item {
    padding: 0.3rem;
    background: rgba(18, 18, 42, 0.6);
    border: 1px solid rgba(123, 92, 245, 0.2);
    border-radius: 0.2rem;
    text-align: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(123, 92, 245, 0.15);
      border-color: rgba(123, 92, 245, 0.5);
      transform: scale(1.02);
    }
    
    .adv-icon {
      font-size: 0.6rem;
      margin-bottom: 0.15rem;
    }
    
    .adv-title {
      font-size: 0.32rem;
      font-weight: bold;
      color: #f8f4ff;
      margin-bottom: 0.1rem;
    }
    
    .adv-desc {
      font-size: 0.24rem;
      color: rgba(248, 244, 255, 0.7);
      line-height: 1.5;
    }
  }
}

// 用户评价
.testimonials-section {
  margin-bottom: 0.5rem;
  
  .testimonials-carousel {
    position: relative;
    height: 3.5rem;
    overflow: hidden;
    
    @media (max-width: 900px) {
      height: 4.5rem;
    }
  }
  
  .testimonial-card {
    position: absolute;
    width: 100%;
    padding: 0.4rem;
    background: linear-gradient(135deg, rgba(123, 92, 245, 0.1) 0%, rgba(18, 18, 42, 0.8) 100%);
    border: 1px solid rgba(123, 92, 245, 0.3);
    border-radius: 0.3rem;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.5s ease;
    
    &.active {
      opacity: 1;
      transform: translateX(0);
    }
    
    .quote-icon {
      font-size: 0.8rem;
      color: rgba(245, 213, 71, 0.3);
      font-family: serif;
      line-height: 0.5;
    }
    
    .testimonial-content {
      font-size: 0.3rem;
      line-height: 1.8;
      color: rgba(248, 244, 255, 0.9);
      margin: 0.2rem 0;
      padding-left: 0.3rem;
      border-left: 3px solid rgba(245, 213, 71, 0.5);
    }
    
    .testimonial-footer {
      display: flex;
      align-items: center;
      margin-top: 0.3rem;
      
      .user-avatar {
        font-size: 0.6rem;
        margin-right: 0.2rem;
      }
      
      .user-info {
        flex: 1;
        
        .user-name {
          font-size: 0.3rem;
          font-weight: bold;
          color: #f8f4ff;
        }
        
        .user-tag {
          font-size: 0.24rem;
          color: rgba(248, 244, 255, 0.6);
        }
      }
      
      .rating {
        .star {
          color: rgba(248, 244, 255, 0.3);
          font-size: 0.35rem;
          
          &.filled {
            color: #F5D547;
            text-shadow: 0 0 10px rgba(245, 213, 71, 0.5);
          }
        }
      }
    }
  }
  
  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 0.15rem;
    margin-top: 0.3rem;
    
    .dot {
      width: 0.15rem;
      height: 0.15rem;
      border-radius: 50%;
      background: rgba(123, 92, 245, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.active {
        background: #F5D547;
        box-shadow: 0 0 10px rgba(245, 213, 71, 0.5);
        transform: scale(1.2);
      }
      
      &:hover {
        background: rgba(123, 92, 245, 0.6);
      }
    }
  }
}

// 权威认证
.certifications {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.3rem;
  background: rgba(18, 18, 42, 0.5);
  border-radius: 0.2rem;
  border: 1px solid rgba(123, 92, 245, 0.15);
  
  .cert-item {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    font-size: 0.26rem;
    color: rgba(248, 244, 255, 0.7);
    
    .cert-icon {
      font-size: 0.35rem;
    }
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
