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
        // 这里应该调用后端 API
        // const response = await api.tarot.draw({ spread })
        // const reading = response.data
        
        // 临时模拟数据
        const reading = {
          spreadId: spread,
          cards: [
            {
              id: 1,
              name: 'The Magician',
              position: 'single',
              reversed: false,
              meaning: 'Manifestation, resourcefulness, power, inspired action'
            }
          ],
          interpretation: 'The Magician appears in your reading, indicating a time of great potential and power...'
        }
        
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
        // 这里应该调用后端 API
        // const response = await api.astrology.generateChart({
        //   birthDate,
        //   birthTime,
        //   birthLocation
        // })
        // const chart = response.data
        
        // 临时模拟数据
        const chart = {
          birthDate,
          birthTime,
          birthLocation,
          sunSign: 'Capricorn',
          moonSign: 'Pisces',
          risingSign: 'Libra',
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
        // 这里应该调用后端 API
        // const response = await api.astrology.getHoroscopes()
        // const horoscopes = response.data
        
        // 临时模拟数据
        const horoscopes = [
          {
            zodiacSign: 'Aries',
            date: new Date().toISOString().split('T')[0],
            dailyReading: 'Today brings new opportunities...',
            love: 'Romance is in the air...',
            career: 'Focus on your goals...',
            health: 'Take care of yourself...',
            luckyNumber: 7,
            luckyColor: 'Red',
            luckyTime: '3 PM'
          }
          // ... 其他 11 个星座
        ]
        
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
        // 这里应该调用后端 API
        // const response = await api.numerology.calculate({
        //   birthDate,
        //   fullName
        // })
        // const results = response.data
        
        // 临时模拟数据
        const results = {
          birthDate,
          fullName,
          lifePathNumber: 7,
          destinyNumber: 5,
          personalYearNumber: 3,
          nameNumber: 8,
          lifePathDescription: 'The Seeker...',
          destinyDescription: 'The Freedom Lover...',
          personalYearDescription: 'A year of creativity...',
          nameDescription: 'The Achiever...'
        }
        
        commit('SET_NUMEROLOGY_RESULTS', results)
        commit('SET_SUCCESS_MESSAGE', 'Numerology calculation completed')
        
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
      // 保存到 localStorage
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
