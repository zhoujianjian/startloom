// 西方版本 Vuex 状态管理
// Western Version Vuex Store Module

export default {
  namespaced: true,
  
  state: {
    // 塔罗牌相关
    currentTarotReading: null,
    tarotHistory: [],
    selectedTarotSpread: 'single-card',
    
    // 星座相关
    selectedZodiac: null,
    birthChart: null,
    horoscopes: [],
    
    // 数字学相关
    numerologyResults: null,
    
    // 用户偏好
    userPreferences: {
      language: 'en',
      theme: 'dark',
      notifications: true
    },
    
    // UI 状态
    isLoading: false,
    error: null,
    successMessage: null
  },
  
  mutations: {
    // 塔罗牌 mutations
    SET_CURRENT_TAROT_READING(state, reading) {
      state.currentTarotReading = reading
    },
    
    ADD_TAROT_TO_HISTORY(state, reading) {
      state.tarotHistory.unshift({
        ...reading,
        timestamp: new Date().toISOString()
      })
      // 只保留最近 50 条记录
      if (state.tarotHistory.length > 50) {
        state.tarotHistory.pop()
      }
    },
    
    CLEAR_TAROT_HISTORY(state) {
      state.tarotHistory = []
    },
    
    SET_SELECTED_TAROT_SPREAD(state, spread) {
      state.selectedTarotSpread = spread
    },
    
    // 星座 mutations
    SET_SELECTED_ZODIAC(state, zodiac) {
      state.selectedZodiac = zodiac
    },
    
    SET_BIRTH_CHART(state, chart) {
      state.birthChart = chart
    },
    
    SET_HOROSCOPES(state, horoscopes) {
      state.horoscopes = horoscopes
    },
    
    // 数字学 mutations
    SET_NUMEROLOGY_RESULTS(state, results) {
      state.numerologyResults = results
    },
    
    // 用户偏好 mutations
    SET_USER_PREFERENCES(state, preferences) {
      state.userPreferences = {
        ...state.userPreferences,
        ...preferences
      }
    },
    
    SET_LANGUAGE(state, language) {
      state.userPreferences.language = language
    },
    
    SET_THEME(state, theme) {
      state.userPreferences.theme = theme
    },
    
    // UI 状态 mutations
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    
    SET_ERROR(state, error) {
      state.error = error
    },
    
    CLEAR_ERROR(state) {
      state.error = null
    },
    
    SET_SUCCESS_MESSAGE(state, message) {
      state.successMessage = message
    },
    
    CLEAR_SUCCESS_MESSAGE(state) {
      state.successMessage = null
    }
  },
  
  actions: {
    // 塔罗牌 actions
    async drawTarotCard({ commit }, { spread = 'single-card' } = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      try {
        const deck = [
          'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant',
          'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
          'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star',
          'The Moon', 'The Sun', 'Judgement', 'The World'
        ]

        const spreadMeta = {
          'single-card': {
            count: 1,
            positions: ['single']
          },
          'three-card': {
            count: 3,
            positions: ['past', 'present', 'future']
          },
          'celtic-cross': {
            count: 10,
            positions: ['present', 'challenge', 'past', 'future', 'above', 'below', 'advice', 'external', 'hopes', 'outcome']
          }
        }

        const meta = spreadMeta[spread] || spreadMeta['single-card']
        const pickUnique = (n) => {
          const pool = [...deck]
          const res = []
          while (res.length < n && pool.length > 0) {
            const idx = Math.floor(Math.random() * pool.length)
            res.push(pool.splice(idx, 1)[0])
          }
          return res
        }

        const picked = pickUnique(meta.count)
        const cards = picked.map((name, idx) => {
          const reversed = Math.random() < 0.33
          const position = meta.positions[idx] || `pos-${idx + 1}`
          return {
            id: idx + 1,
            name,
            position,
            reversed,
            meaning: reversed
              ? 'blocked energy, inner work, a lesson to integrate'
              : 'forward momentum, clarity, alignment and growth'
          }
        })

        const interpretation = `Your ${spread.replace('-', ' ')} reading highlights ${cards
          .slice(0, 3)
          .map(c => `${c.name}${c.reversed ? ' (reversed)' : ''}`)
          .join(', ')}. Focus on one actionable step today, and let the bigger picture unfold naturally.`

        const reading = { spreadId: spread, cards, interpretation }
        
        commit('SET_CURRENT_TAROT_READING', reading)
        commit('ADD_TAROT_TO_HISTORY', reading)
        commit('SET_SUCCESS_MESSAGE', 'Tarot card drawn successfully')
        
        return reading
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to draw tarot card')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    clearTarotHistory({ commit }) {
      commit('CLEAR_TAROT_HISTORY')
      commit('SET_SUCCESS_MESSAGE', 'Tarot history cleared')
    },
    
    setSelectedTarotSpread({ commit }, spread) {
      commit('SET_SELECTED_TAROT_SPREAD', spread)
    },
    
    // 星座 actions
    async fetchBirthChart({ commit }, { birthDate, birthTime, birthLocation }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      try {
        const getSunSign = (dateStr) => {
          const d = new Date(dateStr)
          if (Number.isNaN(d.getTime())) return 'Aries'
          const m = d.getMonth() + 1
          const day = d.getDate()

          const ranges = [
            { s: 'Capricorn', from: [12, 22], to: [1, 19] },
            { s: 'Aquarius', from: [1, 20], to: [2, 18] },
            { s: 'Pisces', from: [2, 19], to: [3, 20] },
            { s: 'Aries', from: [3, 21], to: [4, 19] },
            { s: 'Taurus', from: [4, 20], to: [5, 20] },
            { s: 'Gemini', from: [5, 21], to: [6, 20] },
            { s: 'Cancer', from: [6, 21], to: [7, 22] },
            { s: 'Leo', from: [7, 23], to: [8, 22] },
            { s: 'Virgo', from: [8, 23], to: [9, 22] },
            { s: 'Libra', from: [9, 23], to: [10, 22] },
            { s: 'Scorpio', from: [10, 23], to: [11, 21] },
            { s: 'Sagittarius', from: [11, 22], to: [12, 21] }
          ]

          const inRange = (mm, dd, from, to) => {
            const [fm, fd] = from
            const [tm, td] = to
            if (fm <= tm) {
              return (mm > fm || (mm === fm && dd >= fd)) && (mm < tm || (mm === tm && dd <= td))
            }
            return (mm > fm || (mm === fm && dd >= fd)) || (mm < tm || (mm === tm && dd <= td))
          }

          for (const r of ranges) {
            if (inRange(m, day, r.from, r.to)) return r.s
          }
          return 'Aries'
        }

        const pickBySeed = (seed, list) => {
          let x = seed
          x = (x * 9301 + 49297) % 233280
          const idx = Math.floor((x / 233280) * list.length)
          return list[idx]
        }

        const sunSign = getSunSign(birthDate)
        const signList = [
          'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ]

        const d = new Date(birthDate)
        const baseSeed = (d.getFullYear() || 2000) * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
        const timeSeed = String(birthTime || '00:00').replace(':', '')
        const seed = baseSeed + Number(timeSeed || 0)

        const moonSign = pickBySeed(seed + 17, signList)
        const risingSign = pickBySeed(seed + 39, signList)

        const chart = {
          birthDate,
          birthTime,
          birthLocation,
          sunSign,
          moonSign,
          risingSign,
          planets: [],
          houses: [],
          aspects: []
        }
        
        commit('SET_BIRTH_CHART', chart)
        commit('SET_SUCCESS_MESSAGE', 'Birth chart generated successfully')
        
        return chart
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to generate birth chart')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchHoroscopes({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      
      try {
        const signs = [
          'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ]

        const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Pink', 'Gold']
        const times = ['9 AM', '11 AM', '1 PM', '3 PM', '6 PM', '8 PM']
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0]
        const seed = Number(dateStr.replaceAll('-', ''))

        const pick = (s, list) => {
          let x = seed + s
          x = (x * 9301 + 49297) % 233280
          return list[Math.floor((x / 233280) * list.length)]
        }

        const templates = {
          daily: [
            'A fresh perspective clears the path. Say yes to one small brave move.',
            'Slow and steady wins today. Build something solid and keep your boundaries.',
            'Your words carry power. Choose clarity over overthinking and you’ll move faster.',
            'Nurture what matters. A gentle reset helps you make the right decision.',
            'Confidence is magnetic. Lead with heart, not ego.',
            'Refine, simplify, and improve. Your future self will thank you.',
            'Balance returns when you name what you need. Be direct and kind.',
            'Your intuition is sharp. Don’t ignore the quiet signal.',
            'Adventure calls. Expand one comfort zone today.',
            'Discipline brings results. One focused hour beats a scattered day.',
            'New ideas arrive quickly. Capture them before they fade.',
            'Rest and imagination unlock answers. Trust the feeling beneath the noise.'
          ]
        }

        const horoscopes = signs.map((z, idx) => {
          const luckyNumber = ((seed + idx * 7) % 9) + 1
          const luckyColor = pick(idx * 13, colors)
          const luckyTime = pick(idx * 19, times)
          const dailyReading = templates.daily[idx]

          const love = 'Focus on honesty and timing. A simple message can shift the mood.'
          const career = 'Prioritize one key task. Momentum grows when you finish what you start.'
          const health = 'Hydrate and move gently. Consistency matters more than intensity.'

          return {
            zodiacSign: z,
            date: dateStr,
            dailyReading,
            love,
            career,
            health,
            luckyNumber,
            luckyColor,
            luckyTime
          }
        })
        
        commit('SET_HOROSCOPES', horoscopes)
        
        return horoscopes
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch horoscopes')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    setSelectedZodiac({ commit }, zodiac) {
      commit('SET_SELECTED_ZODIAC', zodiac)
    },

    // 数字学 actions
    async calculateNumerology({ commit }, { birthDate, fullName }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const reduceToDigit = (n) => {
          let x = Math.abs(Number(n) || 0)
          const keep = new Set([11, 22, 33])
          while (x > 9 && !keep.has(x)) {
            x = String(x)
              .split('')
              .reduce((sum, c) => sum + Number(c), 0)
          }
          return x
        }

        const digits = String(birthDate || '').replaceAll('-', '')
        const lifePath = reduceToDigit(
          digits
            .split('')
            .reduce((sum, c) => sum + Number(c || 0), 0)
        )

        const mapChar = (ch) => {
          const c = String(ch || '').toUpperCase()
          if (c < 'A' || c > 'Z') return 0
          const val = c.charCodeAt(0) - 64
          return ((val - 1) % 9) + 1
        }

        const nameSum = String(fullName || '')
          .split('')
          .reduce((sum, ch) => sum + mapChar(ch), 0)
        const destinyNumber = reduceToDigit(nameSum)
        const nameNumber = destinyNumber

        const now = new Date()
        const personalYear = reduceToDigit(
          Number(String(now.getFullYear())) +
            Number(String(now.getMonth() + 1)) +
            Number(String(now.getDate())) +
            Number(digits.slice(-4) || 0)
        )

        const shortDesc = (label, num) => {
          const map = {
            1: 'initiative and independence',
            2: 'partnership and sensitivity',
            3: 'creativity and expression',
            4: 'stability and discipline',
            5: 'change and freedom',
            6: 'care and responsibility',
            7: 'insight and spirituality',
            8: 'power and achievement',
            9: 'completion and compassion',
            11: 'intuition and inspiration',
            22: 'master builder energy',
            33: 'service and teaching'
          }
          return `${label} emphasizes ${map[num] || 'balance and growth'}.`
        }

        const results = {
          birthDate,
          fullName,
          lifePathNumber: lifePath,
          destinyNumber,
          personalYearNumber: personalYear,
          nameNumber,
          lifePathDescription: shortDesc('Life Path', lifePath),
          destinyDescription: shortDesc('Destiny', destinyNumber),
          personalYearDescription: shortDesc('Personal Year', personalYear),
          nameDescription: shortDesc('Name Number', nameNumber)
        }

        commit('SET_NUMEROLOGY_RESULTS', results)
        commit('SET_SUCCESS_MESSAGE', 'Numerology calculated successfully')

        return results
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to calculate numerology')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // 用户偏好 actions
    setUserPreferences({ commit }, preferences) {
      commit('SET_USER_PREFERENCES', preferences)
      localStorage.setItem('western_preferences', JSON.stringify(preferences))
    },

    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
      localStorage.setItem('western_language', language)
    },

    setTheme({ commit }, theme) {
      commit('SET_THEME', theme)
      localStorage.setItem('western_theme', theme)
    },

    // UI 状态 actions
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },

    clearSuccessMessage({ commit }) {
      commit('CLEAR_SUCCESS_MESSAGE')
    }
  },

  getters: {
    // 塔罗牌 getters
    currentTarotReading: state => state.currentTarotReading,
    tarotHistory: state => state.tarotHistory,
    tarotHistoryCount: state => state.tarotHistory.length,
    selectedTarotSpread: state => state.selectedTarotSpread,

    // 星座 getters
    selectedZodiac: state => state.selectedZodiac,
    birthChart: state => state.birthChart,
    horoscopes: state => state.horoscopes,
    horoscopeByZodiac: state => zodiac => {
      return state.horoscopes.find(h => h.zodiacSign === zodiac)
    },

    // 数字学 getters
    numerologyResults: state => state.numerologyResults,

    // 用户偏好 getters
    userPreferences: state => state.userPreferences,
    language: state => state.userPreferences.language,
    theme: state => state.userPreferences.theme,

    // UI 状态 getters
    isLoading: state => state.isLoading,
    error: state => state.error,
    successMessage: state => state.successMessage,
    hasError: state => !!state.error,
    hasSuccessMessage: state => !!state.successMessage
  }
}
