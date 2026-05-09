<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <nav class="top-nav">
      <div class="nav-content">
        <div class="nav-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="nav-tab"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <button class="theme-toggle" @click="toggleTheme">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 标题区域 -->
      <header class="page-header">
        <h1 class="page-title">多平台去水印工具</h1>
        <p class="page-subtitle">支持小红书 · 微博 · 抖音 · 快手 · 豆包 等主流平台</p>
      </header>

      <!-- 去水印功能区域 -->
      <section v-if="activeTab === 'watermark'" class="feature-section">
        <div class="input-card">
          <div class="card-body">
            <div class="url-input-group">
              <div class="input-field-wrapper">
                <label class="field-label">视频/图文链接</label>
                <div class="input-box">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  <input
                    v-model="urlInput"
                    type="text"
                    placeholder="粘贴链接，自动识别平台..."
                    @input="handleUrlInput"
                    @paste="handlePaste"
                    class="url-field"
                  />
                  <button 
                    v-if="urlInput"
                    class="clear-input-btn"
                    @click="clearInput"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>

              <button 
                @click="handleRemoveWatermark"
                class="action-button primary"
                :disabled="!urlInput || !detectedPlatform || isLoading"
              >
                <span v-if="isLoading" class="button-loader"></span>
                <span v-else>解析处理</span>
              </button>
            </div>

            <!-- 平台识别状态 -->
            <div v-if="detectedPlatform" class="platform-status">
              <span class="status-label">已识别平台：</span>
              <span class="platform-tag" :style="{ background: detectedPlatform.color + '15', color: detectedPlatform.color, borderColor: detectedPlatform.color + '30' }">
                {{ detectedPlatform.icon }} {{ detectedPlatform.name }}
              </span>
            </div>

            <!-- 错误提示 -->
            <div v-if="inputError" class="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ inputError }}</span>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在解析内容...</p>
        </div>

        <!-- 结果展示 -->
        <div v-if="result && !isLoading" class="result-container">
          <div class="result-card" :class="{ success: result.success, error: !result.success }">
            <div class="result-header">
              <div class="result-title-group">
                <div class="status-indicator" :class="result.success ? 'success' : 'error'"></div>
                <h3>{{ result.success ? '解析成功' : '解析失败' }}</h3>
              </div>
              <button @click="clearResult" class="close-result-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div v-if="result.success" class="result-content">
              <!-- 视频结果 -->
              <div v-if="result.videoUrl" class="media-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  <h4>视频资源</h4>
                </div>
                <video :src="result.videoUrl" controls class="video-player"></video>
                <div class="media-links">
                  <a :href="result.videoUrl" target="_blank" download class="link-button primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    下载视频
                  </a>
                  <button @click="copyToClipboard(result.videoUrl)" class="link-button secondary">
                    复制链接
                  </button>
                </div>
              </div>

              <!-- 图片结果 -->
              <div v-if="result.images && result.images.length > 0" class="media-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <h4>图片资源 ({{ result.images.length }}张)</h4>
                </div>
                <div class="images-grid">
                  <div v-for="(img, idx) in result.images" :key="idx" class="image-item">
                    <img :src="img" alt="图片" loading="lazy" />
                    <div class="image-overlay">
                      <a :href="img" target="_blank" download class="download-overlay-btn">下载</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 实况照片 -->
              <div v-if="result.livePhotos && result.livePhotos.length > 0" class="media-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  <h4>实况照片 ({{ result.livePhotos.length }}张)</h4>
                </div>
                <div class="live-photos-grid">
                  <div v-for="(photo, idx) in result.livePhotos" :key="idx" class="live-photo-item">
                    <img :src="photo.image" alt="实况照片" />
                    <div class="live-actions">
                      <a :href="photo.image" target="_blank" download class="live-action-btn">图片</a>
                      <a v-if="photo.video" :href="photo.video" target="_blank" download class="live-action-btn video">视频</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 音乐信息 -->
              <div v-if="result.music" class="media-section">
                <div class="section-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                  <h4>背景音乐</h4>
                </div>
                <div class="music-info-grid">
                  <div class="info-row">
                    <span class="info-label">歌曲名</span>
                    <span class="info-value">{{ result.music.title }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">歌手</span>
                    <span class="info-value">{{ result.music.author }}</span>
                  </div>
                </div>
                <audio :src="result.music.url" controls class="audio-player"></audio>
                <div class="media-links">
                  <a :href="result.music.url" target="_blank" download class="link-button primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    下载音乐
                  </a>
                  <button @click="copyToClipboard(result.music.url)" class="link-button secondary">复制链接</button>
                </div>
              </div>

              <!-- 元信息 -->
              <div v-if="result.title || result.author || result.type" class="meta-info-section">
                <div v-if="result.title" class="meta-row">
                  <span class="meta-label">标题</span>
                  <span class="meta-value">{{ result.title }}</span>
                </div>
                <div v-if="result.author" class="meta-row">
                  <span class="meta-label">作者</span>
                  <span class="meta-value">{{ result.author }}</span>
                </div>
                <div v-if="result.type" class="meta-row">
                  <span class="meta-label">类型</span>
                  <span class="type-badge">{{ result.type }}</span>
                </div>
              </div>
            </div>

            <!-- 错误内容 -->
            <div v-else class="error-content">
              <p class="error-text">{{ result.error }}</p>
              <p class="error-hint">请检查链接是否正确或稍后重试</p>
              <button @click="clearResult" class="retry-button">重新尝试</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 音乐搜索区域 -->
      <section v-if="activeTab === 'music'" class="feature-section">
        <div class="search-card">
          <div class="card-body">
            <div class="search-input-group">
              <div class="search-field-wrapper">
                <label class="field-label">音乐 ID</label>
                <div class="search-box">
                  <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18V5l12-2v13"/>
                    <circle cx="6" cy="18" r="3"/>
                    <circle cx="18" cy="16" r="3"/>
                  </svg>
                  <input
                    v-model="musicKeyword"
                    type="text"
                    placeholder="请输入网易云音乐歌曲ID..."
                    @keyup.enter="handleMusicSearch"
                    class="search-field"
                  />
                </div>
              </div>

              <select v-model="musicType" class="type-selector">
                <option value="song">🎵 歌曲详情</option>
                <option value="lyric">📝 获取歌词</option>
                <option value="down">⬇️ 下载音乐</option>
              </select>

              <button 
                @click="handleMusicSearch"
                class="action-button secondary"
                :disabled="!musicKeyword || isSearchingMusic"
              >
                <span v-if="isSearchingMusic" class="button-loader small"></span>
                <span v-else>查询</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 音乐搜索结果 -->
        <div v-if="musicResult && !isSearchingMusic" class="music-results">
          <!-- 歌曲详情 -->
          <div v-if="musicResult.success && musicType === 'song'" class="song-detail-card">
            <div class="card-header">
              <h3>歌曲详情</h3>
            </div>
            <div class="song-detail-content" v-if="musicResult.songs?.length > 0 || musicResult.data">
              <div class="song-main-info">
                <div v-if="(musicResult.songs?.[0]?.album?.picUrl) || (musicResult.data?.album?.picUrl)" class="song-cover">
                  <img :src="musicResult.songs?.[0]?.album?.picUrl || musicResult.data?.album?.picUrl" alt="封面" />
                </div>
                <div class="song-info-text">
                  <h4 class="song-title">{{ musicResult.songs?.[0]?.name || musicResult.data?.name || musicResult.data?.title || '未知歌曲' }}</h4>
                  <p class="song-artist">歌手：{{ musicResult.songs?.[0]?.artists?.map(a => a.name).join(' / ') || musicResult.data?.artists?.map(a => a.name).join(' / ') || musicResult.data?.artist || '未知' }}</p>
                  <p class="song-album">专辑：{{ musicResult.songs?.[0]?.album?.name || musicResult.data?.album?.name || '-' }}</p>
                </div>
              </div>
              
              <!-- 操作按钮 -->
              <div class="song-actions">
                <button @click="handleSongAction(musicResult.songs?.[0] || musicResult.data, 'url')" class="action-button primary">
                  ▶ 播放
                </button>
                <button @click="handleSongAction(musicResult.songs?.[0] || musicResult.data, 'lyric')" class="action-button secondary-style">
                  📝 歌词
                </button>
                <button @click="handleSongAction(musicResult.songs?.[0] || musicResult.data, 'down')" class="action-button download-style">
                  ⬇ 下载
                </button>
              </div>
            </div>
            <div v-else class="no-data">
              <p>未找到歌曲信息</p>
            </div>
          </div>

          <!-- 歌词显示 -->
          <div v-if="musicResult.success && (musicType === 'lyric' || musicResult.lyric)" class="lyric-card">
            <div class="card-header">
              <h3>歌词</h3>
            </div>
            <pre class="lyric-content">{{ musicResult.lyric }}</pre>
          </div>

          <!-- 播放/下载 -->
          <div v-if="musicResult.success && (musicType === 'down' || musicResult.url)" class="player-card">
            <div class="card-header">
              <h3>播放 / 下载</h3>
            </div>
            <audio :src="musicResult.url" controls class="player-audio" crossorigin="anonymous" @error="handleAudioError"></audio>
            <div class="player-actions">
              <a :href="musicResult.url" target="_blank" download class="link-button primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下载 MP3
              </a>
              <a :href="musicResult.url" target="_blank" class="link-button secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                在新窗口播放
              </a>
              <button @click="copyToClipboard(musicResult.url)" class="link-button secondary">复制链接</button>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="!musicResult.success" class="error-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <p>{{ musicResult.error }}</p>
            <p class="error-hint">请检查ID是否正确</p>
          </div>
        </div>

        <!-- 音乐加载状态 -->
        <div v-if="isSearchingMusic" class="loading-state">
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p>正在搜索...</p>
        </div>
      </section>

    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <p>本工具仅供学习交流使用，请尊重原作者版权</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { detectPlatform, isValidUrl } from '../utils/platformDetector.js'
import { removeWatermark, searchNeteaseMusic } from '../services/watermarkService.js'

const activeTab = ref('watermark')
const tabs = [
  { id: 'watermark', label: '去水印' },
  { id: 'music', label: '音乐搜索' }
]

const urlInput = ref('')
const detectedPlatform = ref(null)
const inputError = ref('')
const isLoading = ref(false)
const result = ref(null)

const musicKeyword = ref('')
const musicType = ref('search')
const isSearchingMusic = ref(false)
const musicResult = ref(null)
const isSongLoading = ref(false)
const audioError = ref(false)

let debounceTimer = null

function toggleTheme() {
  // 可以在这里实现主题切换逻辑
}

function handleUrlInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  debounceTimer = setTimeout(() => {
    inputError.value = ''
    
    if (urlInput.value.trim()) {
      if (isValidUrl(urlInput.value)) {
        const platform = detectPlatform(urlInput.value)
        detectedPlatform.value = platform
        
        if (!platform) {
          inputError.value = '暂不支持该平台或链接格式不正确'
        }
      } else {
        inputError.value = '请输入有效的URL地址'
        detectedPlatform.value = null
      }
    } else {
      detectedPlatform.value = null
    }
  }, 300)
}

async function handlePaste(event) {
  const pastedText = event.clipboardData.getData('text')
  urlInput.value = pastedText.trim()
  handleUrlInput()
}

async function handleRemoveWatermark() {
  if (!urlInput.value || !detectedPlatform.value) return
  
  isLoading.value = true
  result.value = null
  
  try {
    const response = await removeWatermark(urlInput.value, detectedPlatform.value.key)
    result.value = response
  } catch (error) {
    console.error('处理失败:', error)
    result.value = {
      success: false,
      error: '处理过程中出现错误: ' + error.message
    }
  } finally {
    isLoading.value = false
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('已复制到剪贴板')
  }).catch(() => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast('已复制到剪贴板')
  })
}

function showToast(message) {
  const toast = document.createElement('div')
  toast.className = 'toast-notification'
  toast.textContent = message
  document.body.appendChild(toast)
  
  setTimeout(() => toast.classList.add('show'), 10)
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}

function clearResult() {
  result.value = null
  urlInput.value = ''
  detectedPlatform.value = null
  inputError.value = ''
}

function clearInput() {
  urlInput.value = ''
  detectedPlatform.value = null
  inputError.value = ''
}

function handleAudioError(event) {
  audioError.value = true
  console.error('音频播放失败:', event)
}

async function handleMusicSearch() {
  if (!musicKeyword.value.trim()) return
  
  isSearchingMusic.value = true
  musicResult.value = null
  audioError.value = false
  
  try {
    const response = await searchNeteaseMusic(musicKeyword.value, musicType.value)
    musicResult.value = response
    
    console.log('[音乐查询] 完整响应:', response)
    
    if (response.success && !response.url && (musicType.value === 'url' || musicType.value === 'down')) {
      showToast('未获取到播放链接，请尝试其他操作')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    musicResult.value = {
      success: false,
      error: '搜索失败: ' + error.message
    }
  } finally {
    isSearchingMusic.value = false
  }
}

async function handleSongAction(song, action) {
  if (!song) {
    showToast('无法获取歌曲信息')
    return
  }
  
  const songId = song.id || song.song_id || song.sid || song.songId || song.data?.id || song.data?.song_id
  
  if (!songId) {
    console.error('无法获取歌曲ID - song对象:', song)
    showToast('无法获取歌曲ID，请尝试重新查询')
    return
  }
  
  isSongLoading.value = true
  
  try {
    let response
    
    switch(action) {
      case 'url':
        response = await searchNeteaseMusic(songId, 'url')
        if (response.success && response.url) {
          musicResult.value = { ...musicResult.value, url: response.url }
          showToast('获取播放链接成功！')
        } else {
          showToast(response.error || '获取播放链接失败')
        }
        break
        
      case 'lyric':
        response = await searchNeteaseMusic(songId, 'lyric')
        if (response.success && response.lyric) {
          musicResult.value = { ...musicResult.value, lyric: response.lyric }
          showToast('获取歌词成功！')
        } else {
          showToast(response.error || '获取歌词失败')
        }
        break
        
      case 'down':
        response = await searchNeteaseMusic(songId, 'down')
        if (response.success && response.url) {
          const link = document.createElement('a')
          link.href = response.url
          link.download = `${song.name || 'music'}.mp3`
          link.target = '_blank'
          link.click()
          showToast('正在下载...')
        } else {
          showToast(response.error || '下载链接获取失败')
        }
        break
    }
  } catch (error) {
    console.error('操作失败:', error)
    showToast('操作失败: ' + error.message)
  } finally {
    isSongLoading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

/* 顶部导航 */
.top-nav {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}

.nav-tabs {
  display: flex;
  gap: 8px;
}

.nav-tab {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-tab:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-tab.active {
  background: #e8f4fd;
  color: #1890ff;
  font-weight: 600;
}

.theme-toggle {
  padding: 8px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background: #f5f5f5;
  color: #333;
}

/* 主内容区 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #888;
  font-weight: 400;
}

/* 功能区块 */
.feature-section {
  margin-bottom: 32px;
}

/* 卡片基础样式 */
.input-card,
.search-card,
.result-card,
.songs-list-card,
.song-detail-card,
.lyric-card,
.player-card,
.error-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  margin-bottom: 16px;
}

.card-body {
  padding: 24px;
}

.card-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* 输入组 */
.url-input-group,
.search-input-group {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-field-wrapper,
.search-field-wrapper {
  flex: 1;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.input-box,
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
}

.input-box:focus-within,
.search-box:focus-within {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.input-icon,
.search-icon {
  color: #bbb;
  flex-shrink: 0;
}

.url-field,
.search-field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  background: transparent;
}

.url-field::placeholder,
.search-field::placeholder {
  color: #bbb;
}

.clear-input-btn {
  padding: 4px;
  border: none;
  background: transparent;
  color: #bbb;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-input-btn:hover {
  color: #666;
  background: #f5f5f5;
}

/* 操作按钮 */
.action-button {
  padding: 10px 28px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: fit-content;
}

.action-button.primary {
  background: #1890ff;
  color: white;
}

.action-button.primary:hover:not(:disabled) {
  background: #40a9ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35);
}

.action-button.primary:disabled {
  background: #d9d9d9;
  color: #fff;
  cursor: not-allowed;
}

.action-button.secondary {
  background: #52c41a;
  color: white;
}

.action-button.secondary:hover:not(:disabled) {
  background: #73d13d;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.35);
}

.action-button.secondary:disabled {
  background: #d9d9d9;
  color: #fff;
  cursor: not-allowed;
}

.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

.button-loader.small {
  width: 14px;
  height: 14px;
  border-width: 2px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 类型选择器 */
.type-selector {
  padding: 10px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background: white;
  cursor: pointer;
  outline: none;
  min-width: 120px;
}

.type-selector:focus {
  border-color: #52c41a;
}

/* 平台状态 */
.platform-status {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.platform-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
}

/* 错误消息 */
.error-message {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  color: #cf1322;
  font-size: 13px;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  margin-bottom: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: bounceDot 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounceDot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.loading-state p {
  color: #666;
  font-size: 14px;
}

/* 结果容器 */
.result-container {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-card.success {
  border-left: 3px solid #52c41a;
}

.result-card.error {
  border-left: 3px solid #ff4d4f;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.result-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.success {
  background: #52c41a;
}

.status-indicator.error {
  background: #ff4d4f;
}

.result-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.close-result-btn {
  padding: 6px;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-result-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.result-content {
  padding: 24px;
}

/* 媒体区块 */
.media-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.media-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.section-header svg {
  color: #1890ff;
}

.section-header h4 {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.video-player {
  width: 100%;
  max-height: 450px;
  border-radius: 6px;
  background: #000;
  margin-bottom: 12px;
}

.audio-player,
.player-audio {
  width: 100%;
  border-radius: 6px;
  margin-bottom: 12px;
}

.audio-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  color: #cf1322;
  font-size: 14px;
  margin-bottom: 12px;
}

.media-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.link-button.primary {
  background: #1890ff;
  color: white;
}

.link-button.primary:hover {
  background: #40a9ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35);
}

.link-button.secondary {
  background: white;
  color: #555;
  border: 1px solid #d9d9d9;
}

.link-button.secondary:hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* 图片网格 */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.image-item {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  border: 1px solid #e5e5e5;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.image-item:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.download-overlay-btn {
  padding: 8px 20px;
  background: white;
  color: #333;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.download-overlay-btn:hover {
  background: #1890ff;
  color: white;
}

/* 实况照片 */
.live-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.live-photo-item {
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  overflow: hidden;
  background: white;
}

.live-photo-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.live-actions {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: #fafafa;
}

.live-action-btn {
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  background: #1890ff;
  color: white;
  transition: all 0.2s;
}

.live-action-btn.video {
  background: #52c41a;
}

.live-action-btn:hover {
  opacity: 0.9;
}

/* 音乐信息 */
.music-info-grid {
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}

.info-row {
  display: flex;
  gap: 12px;
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 6px;
}

.info-label {
  font-size: 13px;
  color: #888;
  font-weight: 500;
  min-width: 60px;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

/* 元信息 */
.meta-info-section {
  margin-top: 20px;
  padding: 16px;
  background: #f6f8fa;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}

.meta-row {
  display: flex;
  gap: 12px;
  padding: 8px 0;
}

.meta-row:not(:last-child) {
  border-bottom: 1px solid #e5e5e5;
}

.meta-label {
  font-size: 13px;
  color: #888;
  font-weight: 500;
  min-width: 50px;
}

.meta-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.type-badge {
  display: inline-flex;
  padding: 3px 10px;
  background: #1890ff;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

/* 错误内容 */
.error-content {
  text-align: center;
  padding: 40px 24px;
}

.error-text {
  font-size: 16px;
  font-weight: 600;
  color: #cf1322;
  margin-bottom: 8px;
}

.error-hint {
  font-size: 14px;
  color: #888;
  margin-bottom: 20px;
}

.retry-button {
  padding: 10px 28px;
  border: none;
  border-radius: 6px;
  background: #1890ff;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: #40a9ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35);
}

/* 音乐搜索结果 */
.music-results {
  animation: fadeIn 0.3s ease-out;
}

/* 歌曲表格 */
.songs-table {
  overflow-x: auto;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 140px;
  gap: 12px;
  padding: 12px 16px;
  align-items: center;
  font-size: 13px;
}

.table-head {
  background: #fafafa;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}

.table-row {
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
}

.table-row:hover {
  background: #fafafa;
}

.song-name {
  font-weight: 600;
  color: #333;
}

.artist-name {
  color: #555;
}

.album-name {
  color: #888;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.icon-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.play {
  background: #52c41a;
  color: white;
}

.icon-btn.lyric {
  background: #722ed1;
  color: white;
}

.icon-btn.download {
  background: #1890ff;
  color: white;
}

.icon-btn:hover {
  opacity: 0.85;
  transform: scale(1.05);
}

/* 歌词显示 */
.lyric-content {
  padding: 20px;
  background: #fafafa;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 350px;
  overflow-y: auto;
}

.player-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

/* 歌曲详情卡片 */
.song-detail-content {
  padding: 24px;
}

.song-main-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.song-cover {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-info-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.song-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.song-artist,
.song-album {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.song-actions {
  display: flex;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.action-button.secondary-style {
  background: white;
  color: #555;
  border: 1px solid #d9d9d9;
}

.action-button.secondary-style:hover {
  border-color: #722ed1;
  color: #722ed1;
}

.action-button.download-style {
  background: #52c41a;
  color: white;
}

.action-button.download-style:hover {
  background: #73d13d;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.35);
}

.no-data {
  text-align: center;
  padding: 32px 24px;
  color: #999;
  font-size: 14px;
}

.error-card {
  padding: 32px 24px;
  text-align: center;
  color: #cf1322;
  font-size: 14px;
}

.error-card svg {
  margin-bottom: 12px;
  opacity: 0.7;
}

.error-hint {
  margin-top: 8px;
  color: #888;
  font-size: 13px;
}

/* 页脚 */
.app-footer {
  text-align: center;
  padding: 32px 24px;
  color: #999;
  font-size: 13px;
  border-top: 1px solid #e5e5e5;
  margin-top: 48px;
}

/* Toast通知 */
.toast-notification {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 12px 24px;
  background: #333;
  color: white;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.toast-notification.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .url-input-group,
  .search-input-group {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }

  .type-selector {
    width: 100%;
  }

  .table-head,
  .table-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .col-album {
    display: none;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .live-photos-grid {
    grid-template-columns: 1fr;
  }

  .media-links,
  .player-actions {
    flex-direction: column;
  }

  .link-button {
    width: 100%;
    justify-content: center;
  }

  .song-main-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .song-cover {
    width: 150px;
    height: 150px;
  }

  .song-actions {
    flex-direction: column;
  }

  .song-actions .action-button {
    width: 100%;
  }
}
</style>
