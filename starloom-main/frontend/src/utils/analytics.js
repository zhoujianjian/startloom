/**
 * 自定义埋点统计工具
 */

const STORAGE_KEY = 'starloom-session-id'
let sessionId = null

// 获取或生成会话ID
const getSessionId = () => {
  if (sessionId) return sessionId
  sessionId = localStorage.getItem(STORAGE_KEY)
  if (!sessionId) {
    sessionId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () => 
      Math.floor(Math.random() * 16).toString(16)
    )
    localStorage.setItem(STORAGE_KEY, sessionId)
  }
  return sessionId
}

// 获取设备类型
const getDeviceType = () => {
  const ua = navigator.userAgent
  if (/Mobile|Android|iPhone/i.test(ua)) return 'mobile'
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  return 'pc'
}

// 上报事件
const track = async (eventType, toolId = null) => {
  try {
    const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
    await fetch(`${baseUrl}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        toolId,
        sessionId: getSessionId(),
        deviceType: getDeviceType()
      })
    })
  } catch (e) {
    // 静默失败，不影响用户体验
  }
}

// 页面浏览
export const trackPV = () => track('pv')

// 工具打开
export const trackToolOpen = (toolId) => track('tool_open', toolId)

// 工具使用（提交测算）
export const trackToolUse = (toolId) => track('tool_use', toolId)

// 心跳
let heartbeatTimer = null
export const startHeartbeat = () => {
  if (heartbeatTimer) return
  
  const sendHeartbeat = async () => {
    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
      await fetch(`${baseUrl}/analytics/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: getSessionId() })
      })
    } catch (e) {}
  }
  
  sendHeartbeat()
  heartbeatTimer = setInterval(sendHeartbeat, 60000)
}

export const stopHeartbeat = () => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

// 获取实时统计数据
export const getRealTimeStats = async () => {
  try {
    const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
    const res = await fetch(`${baseUrl}/analytics/realtime`)
    const data = await res.json()
    return data.code === 200 ? data.data : null
  } catch (e) {
    return null
  }
}

export default {
  trackPV,
  trackToolOpen,
  trackToolUse,
  startHeartbeat,
  stopHeartbeat,
  getRealTimeStats,
  getSessionId
}
