// 主题配置文件
export const themes = {
  // 梦幻星空 - 粉紫渐变（当前主题）
  starry: {
    name: '梦幻星空',
    icon: '🌌',
    colors: {
      // 背景
      bgPrimary: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      bgCard: 'rgba(255,255,255,0.06)',
      bgCardHover: 'rgba(240,147,251,0.12)',
      bgHeader: 'rgba(255,255,255,0.08)',
      bgModal: 'linear-gradient(145deg, rgba(48,43,99,0.95), rgba(36,36,62,0.95))',
      bgInput: 'rgba(255,255,255,0.08)',
      bgMobileNav: 'rgba(15,12,41,0.95)',
      // 主色
      primary: '#f093fb',
      primaryEnd: '#f5576c',
      primaryGradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      // 强调色
      accent: '#f5a5c8',
      accentLight: '#c8a5d9',
      // 文字
      textPrimary: '#fff',
      textSecondary: '#e8d5f2',
      textMuted: '#a89cc8',
      // 边框
      border: 'rgba(200,165,217,0.2)',
      borderHover: 'rgba(240,147,251,0.5)',
      borderLight: 'rgba(255,255,255,0.1)',
      // 阴影
      shadow: 'rgba(240,147,251,0.4)',
      shadowHover: 'rgba(240,147,251,0.5)',
      // VIP
      vipGold: 'linear-gradient(135deg, #f093fb, #f5576c)',
      vipDiamond: 'linear-gradient(135deg, #667eea, #764ba2)',
    }
  },

  // 经典金色 - 传统命理风格
  classic: {
    name: '经典金韵',
    icon: '✨',
    colors: {
      bgPrimary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      bgCard: 'rgba(255,255,255,0.05)',
      bgCardHover: 'rgba(255,215,0,0.1)',
      bgHeader: 'rgba(0,0,0,0.3)',
      bgModal: '#1a1a2e',
      bgInput: 'rgba(255,255,255,0.1)',
      bgMobileNav: 'rgba(26,26,46,0.95)',
      primary: '#ffd700',
      primaryEnd: '#ff8c00',
      primaryGradient: 'linear-gradient(135deg, #ffd700, #ff8c00)',
      accent: '#ffd700',
      accentLight: '#ffb347',
      textPrimary: '#fff',
      textSecondary: '#ddd',
      textMuted: '#aaa',
      border: 'rgba(255,215,0,0.2)',
      borderHover: '#ffd700',
      borderLight: 'rgba(255,255,255,0.1)',
      shadow: 'rgba(255,215,0,0.4)',
      shadowHover: 'rgba(255,215,0,0.5)',
      vipGold: 'linear-gradient(135deg, #ffd700, #ff8c00)',
      vipDiamond: 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
    }
  },

  // 国学雅韵 - 浅色传统风格（新增）
  guoxue: {
    name: '国学雅韵',
    icon: '📜',
    colors: {
      bgPrimary: 'linear-gradient(180deg, #f8f6f1 0%, #f0ebe3 100%)',
      bgCard: 'rgba(255,255,255,0.9)',
      bgCardHover: 'rgba(139,90,43,0.08)',
      bgHeader: 'rgba(255,255,255,0.95)',
      bgModal: '#fffef9',
      bgInput: '#fff',
      bgMobileNav: 'rgba(248,246,241,0.98)',
      primary: '#8b5a2b',
      primaryEnd: '#d4a574',
      primaryGradient: 'linear-gradient(135deg, #1a1a1a, #333)',
      accent: '#8b5a2b',
      accentLight: '#c4956a',
      textPrimary: '#333',
      textSecondary: '#555',
      textMuted: '#888',
      border: 'rgba(139,90,43,0.2)',
      borderHover: '#8b5a2b',
      borderLight: 'rgba(139,90,43,0.15)',
      shadow: 'rgba(139,90,43,0.15)',
      shadowHover: 'rgba(139,90,43,0.25)',
      vipGold: 'linear-gradient(135deg, #d4a574, #8b5a2b)',
      vipDiamond: 'linear-gradient(135deg, #333, #1a1a1a)',
    }
  },

  // 清新薄荷 - 清爽绿色
  mint: {
    name: '清新薄荷',
    icon: '🌿',
    colors: {
      bgPrimary: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a4b 50%, #065a60 100%)',
      bgCard: 'rgba(255,255,255,0.06)',
      bgCardHover: 'rgba(0,206,201,0.12)',
      bgHeader: 'rgba(255,255,255,0.08)',
      bgModal: 'linear-gradient(145deg, rgba(27,58,75,0.95), rgba(6,90,96,0.95))',
      bgInput: 'rgba(255,255,255,0.08)',
      bgMobileNav: 'rgba(13,27,42,0.95)',
      primary: '#00cec9',
      primaryEnd: '#55efc4',
      primaryGradient: 'linear-gradient(135deg, #00cec9, #55efc4)',
      accent: '#81ecec',
      accentLight: '#a8e6cf',
      textPrimary: '#fff',
      textSecondary: '#dfe6e9',
      textMuted: '#b2bec3',
      border: 'rgba(129,236,236,0.2)',
      borderHover: 'rgba(0,206,201,0.5)',
      borderLight: 'rgba(255,255,255,0.1)',
      shadow: 'rgba(0,206,201,0.4)',
      shadowHover: 'rgba(0,206,201,0.5)',
      vipGold: 'linear-gradient(135deg, #00cec9, #55efc4)',
      vipDiamond: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
    }
  },

  // 暖阳橙光 - 温暖橙色
  sunset: {
    name: '暖阳橙光',
    icon: '🌅',
    colors: {
      bgPrimary: 'linear-gradient(135deg, #2d1f3d 0%, #4a2c4a 50%, #5c3d5c 100%)',
      bgCard: 'rgba(255,255,255,0.06)',
      bgCardHover: 'rgba(253,121,168,0.12)',
      bgHeader: 'rgba(255,255,255,0.08)',
      bgModal: 'linear-gradient(145deg, rgba(74,44,74,0.95), rgba(92,61,92,0.95))',
      bgInput: 'rgba(255,255,255,0.08)',
      bgMobileNav: 'rgba(45,31,61,0.95)',
      primary: '#fd79a8',
      primaryEnd: '#fdcb6e',
      primaryGradient: 'linear-gradient(135deg, #fd79a8, #fdcb6e)',
      accent: '#fab1a0',
      accentLight: '#ffeaa7',
      textPrimary: '#fff',
      textSecondary: '#ffeaa7',
      textMuted: '#dfe6e9',
      border: 'rgba(253,203,110,0.2)',
      borderHover: 'rgba(253,121,168,0.5)',
      borderLight: 'rgba(255,255,255,0.1)',
      shadow: 'rgba(253,121,168,0.4)',
      shadowHover: 'rgba(253,121,168,0.5)',
      vipGold: 'linear-gradient(135deg, #fd79a8, #fdcb6e)',
      vipDiamond: 'linear-gradient(135deg, #a29bfe, #74b9ff)',
    }
  },

  // 深邃蓝海 - 神秘蓝色
  ocean: {
    name: '深邃蓝海',
    icon: '🌊',
    colors: {
      bgPrimary: 'linear-gradient(135deg, #0c1445 0%, #1a237e 50%, #283593 100%)',
      bgCard: 'rgba(255,255,255,0.06)',
      bgCardHover: 'rgba(100,181,246,0.12)',
      bgHeader: 'rgba(255,255,255,0.08)',
      bgModal: 'linear-gradient(145deg, rgba(26,35,126,0.95), rgba(40,53,147,0.95))',
      bgInput: 'rgba(255,255,255,0.08)',
      bgMobileNav: 'rgba(12,20,69,0.95)',
      primary: '#64b5f6',
      primaryEnd: '#e1bee7',
      primaryGradient: 'linear-gradient(135deg, #64b5f6, #e1bee7)',
      accent: '#90caf9',
      accentLight: '#bbdefb',
      textPrimary: '#fff',
      textSecondary: '#e3f2fd',
      textMuted: '#b3e5fc',
      border: 'rgba(144,202,249,0.2)',
      borderHover: 'rgba(100,181,246,0.5)',
      borderLight: 'rgba(255,255,255,0.1)',
      shadow: 'rgba(100,181,246,0.4)',
      shadowHover: 'rgba(100,181,246,0.5)',
      vipGold: 'linear-gradient(135deg, #64b5f6, #e1bee7)',
      vipDiamond: 'linear-gradient(135deg, #ce93d8, #7e57c2)',
    }
  }
}

// 获取当前主题
export function getCurrentTheme() {
  return localStorage.getItem('starloom-theme') || 'guoxue'
}

// 设置主题
export function setTheme(themeName) {
  localStorage.setItem('starloom-theme', themeName)
  applyTheme(themeName)
}

// 应用主题到CSS变量
export function applyTheme(themeName) {
  const theme = themes[themeName] || themes.starry
  const root = document.documentElement
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}

// 初始化主题
export function initTheme() {
  const themeName = getCurrentTheme()
  applyTheme(themeName)
}
