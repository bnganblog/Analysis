import axios from 'axios'

const API_TIMEOUT = 25000

const api = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})

async function fetchWithRetry(url, options = {}, retries = 2) {
  let lastError = null
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[API] 尝试请求: ${url.substring(0, 80)}... (第${i + 1}次)`)
      const response = await api.get(url, options)
      console.log('[API] 响应状态:', response.status)
      console.log('[API] 响应数据:', JSON.stringify(response.data).substring(0, 200))
      return response
    } catch (error) {
      lastError = error
      console.warn(`[API] 第${i + 1}次失败:`, error.message)
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1500 * (i + 1)))
    }
  }
}

async function useBugpkDouyinApi(url) {
  try {
    const apiUrl = `https://api.bugpk.com/api/douyin?url=${encodeURIComponent(url)}`
    const response = await fetchWithRetry(apiUrl)

    if (response.data) {
      console.log('[抖音BUGPK] 完整响应:', JSON.stringify(response.data))

      const data = response.data

      if (data.code === 200 || data.code === 0 || data.success === true || data.url || data.video_url || data.play_addr) {
        return parseApiResponse(data, 'douyin')
      } else if (data.data) {
        return parseApiResponse(data.data, 'douyin')
      } else {
        throw new Error(data.msg || data.message || '解析失败')
      }
    }

    throw new Error('无效的响应数据')
  } catch (error) {
    console.error('[抖音BUGPK] 失败:', error)
    throw error
  }
}

async function useBugpkXhsApi(url) {
  try {
    const apiUrl = `https://api.bugpk.com/api/xhs?url=${encodeURIComponent(url)}`
    const response = await fetchWithRetry(apiUrl)

    if (response.data) {
      console.log('[小红书BUGPK] 完整响应:', JSON.stringify(response.data))

      const data = response.data

      if (data.code === 200 || data.code === 0 || data.success === true || data.url || data.video_url || data.images) {
        return parseApiResponse(data, 'xiaohongshu')
      } else if (data.data) {
        return parseApiResponse(data.data, 'xiaohongshu')
      } else {
        throw new Error(data.msg || data.message || '解析失败')
      }
    }

    throw new Error('无效的响应数据')
  } catch (error) {
    console.error('[小红书BUGPK] 失败:', error)
    throw error
  }
}

async function useBugpkDoubaoApi(url) {
  try {
    const apiUrl = `https://api.bugpk.com/api/dbduihua?url=${encodeURIComponent(url)}`
    const response = await fetchWithRetry(apiUrl)

    if (response.data) {
      console.log('[豆包BUGPK] 完整响应:', JSON.stringify(response.data))

      const data = response.data

      if (data.code === 200 || data.code === 0 || data.success === true || data.url || data.video_url || data.images || data.content) {
        return parseApiResponse(data, 'doubao')
      } else if (data.data) {
        return parseApiResponse(data.data, 'doubao')
      } else {
        throw new Error(data.msg || data.message || '解析失败')
      }
    }

    throw new Error('无效的响应数据')
  } catch (error) {
    console.error('[豆包BUGPK] 失败:', error)
    throw error
  }
}

async function useBugpkKuaishouApi(url) {
  try {
    const apiUrl = `https://api.bugpk.com/api/kuaishou?url=${encodeURIComponent(url)}`
    const response = await fetchWithRetry(apiUrl)

    if (response.data) {
      console.log('[快手BUGPK] 完整响应:', JSON.stringify(response.data))

      const data = response.data

      if (data.code === 200 || data.code === 0 || data.success === true || data.url || data.video_url || data.play_addr) {
        return parseApiResponse(data, 'kuaishou')
      } else if (data.data) {
        return parseApiResponse(data.data, 'kuaishou')
      } else {
        throw new Error(data.msg || data.message || '解析失败')
      }
    }

    throw new Error('无效的响应数据')
  } catch (error) {
    console.error('[快手BUGPK] 失败:', error)
    throw error
  }
}

async function useBugpkWeiboApi(url) {
  try {
    const apiUrl = `https://api.bugpk.com/api/weibo_v?url=${encodeURIComponent(url)}`
    const response = await fetchWithRetry(apiUrl)

    if (response.data) {
      console.log('[微博BUGPK] 完整响应:', JSON.stringify(response.data))

      const data = response.data

      if (data.code === 200 || data.code === 0 || data.success === true || data.url || data.video_url || data.images || data.pic_urls) {
        return parseApiResponse(data, 'weibo')
      } else if (data.data) {
        return parseApiResponse(data.data, 'weibo')
      } else {
        throw new Error(data.msg || data.message || '解析失败')
      }
    }

    throw new Error('无效的响应数据')
  } catch (error) {
    console.error('[微博BUGPK] 失败:', error)
    throw error
  }
}

async function searchNeteaseMusic(keyword, type = 'search', page = 1, limit = 10) {
  try {
    let apiUrl
    
    switch(type) {
      case 'search':
        apiUrl = `https://api.bugpk.com/api/163_music?type=search&keywords=${encodeURIComponent(keyword)}&limit=${limit}&offset=${(page-1)*limit}`
        break
      case 'song':
        apiUrl = `https://api.bugpk.com/api/163_music?type=song&id=${encodeURIComponent(keyword)}`
        break
      case 'url':
        apiUrl = `https://api.bugpk.com/api/163_music?type=url&id=${encodeURIComponent(keyword)}&level=standard`
        break
      case 'lyric':
        apiUrl = `https://api.bugpk.com/api/163_music?type=lyric&id=${encodeURIComponent(keyword)}`
        break
      case 'playlist':
        apiUrl = `https://api.bugpk.com/api/163_music?type=playlist&id=${encodeURIComponent(keyword)}`
        break
      case 'album':
        apiUrl = `https://api.bugpk.com/api/163_music?type=album&id=${encodeURIComponent(keyword)}`
        break
      case 'down':
        apiUrl = `https://api.bugpk.com/api/163_music?type=url&id=${encodeURIComponent(keyword)}&level=standard`
        break
      default:
        throw new Error('不支持的音乐操作类型')
    }

    console.log(`[网易云音乐] ${type} 请求:`, apiUrl.substring(0, 150))
    const response = await fetchWithRetry(apiUrl)

    if (response.data) {
      console.log('[网易云音乐] 完整响应:', JSON.stringify(response.data))

      const data = response.data

      if (data.code === 200) {
        const result = {
          success: true,
          type: type,
          data: data.data || data,
          rawData: data,
          message: data.msg || '成功'
        }
        
        if (type === 'search') {
          result.songs = data.data?.songs || []
        } else if (type === 'song') {
          result.songs = data.data ? [data.data] : []
        } else if (type === 'url') {
          result.url = data.data?.[0]?.url || data.url
          result.songs = data.data || []
        } else if (type === 'lyric') {
          result.lyric = data.data?.lrc || data.data?.lyric || data.lyric
          result.tlyric = data.data?.tlyric
        } else if (type === 'playlist') {
          result.songs = data.data?.tracks || []
        } else if (type === 'album') {
          result.songs = data.data?.songs || []
        }
        
        console.log('[网易云音乐] 提取结果:', {
          url: result.url,
          hasUrl: !!result.url,
          songCount: result.songs?.length || 0,
          hasLyric: !!result.lyric
        })
        
        return result
      } else {
        throw new Error(data.msg || data.message || '音乐查询失败')
      }
    }

    throw new Error('无效的响应数据')
  } catch (error) {
    console.error('[网易云音乐] 失败:', error)
    return {
      success: false,
      error: error.message,
      type: type
    }
  }
}

async function use317akApi(url, platform) {
  try {
    const platformMap = {
      'xiaohongshu': 'xhs',
      'douyin': 'dy',
      'kuaishou': 'ks',
      'weibo': 'wb',
      'doubao': 'db'
    }

    const platformCode = platformMap[platform] || platform
    const apiUrl = `https://api.317ak.cn/api/spjx/${platformCode}?url=${encodeURIComponent(url)}&ckey=SJKHJDBBDGGE`

    const response = await fetchWithRetry(apiUrl)

    if (response.data) {
      console.log(`[317AK-${platform}] 完整响应:`, JSON.stringify(response.data))
      const data = response.data

      if (data.code === 200 || data.code === 0 || data.success || data.url || data.video_url) {
        return parseApiResponse(data, platform)
      } else if (data.data) {
        return parseApiResponse(data.data, platform)
      } else {
        throw new Error(data.msg || data.message || '解析失败')
      }
    }

    throw new Error('无效的响应数据')
  } catch (error) {
    console.error(`[317AK-${platform}] 失败:`, error)
    throw error
  }
}

function parseApiResponse(data, platform) {
  console.log('[开始解析] 原始数据结构:', JSON.stringify(data).substring(0, 300))

  const result = {
    success: true,
    platform: platform
  }

  const sourceData = data.data || data

  result.type = sourceData.type || 'unknown'
  result.title = sourceData.title || sourceData.desc
  result.coverUrl = sourceData.cover

  if (sourceData.author) {
    if (typeof sourceData.author === 'object') {
      result.author = sourceData.author.name
      result.authorId = sourceData.author.id
      result.authorAvatar = sourceData.author.avatar
    } else {
      result.author = sourceData.author
    }
  } else {
    result.author = sourceData.author_name || sourceData.nickname || sourceData.name
  }

  if (sourceData.url && !sourceData.url.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
    result.videoUrl = sourceData.url
  }
  
  if (!result.videoUrl && sourceData.video_backup) {
    result.videoUrl = sourceData.video_backup
  }

  if (sourceData.images && Array.isArray(sourceData.images) && sourceData.images.length > 0) {
    result.images = sourceData.images.filter(img => img && img.trim() !== '')
  }

  if (sourceData.live_photo && Array.isArray(sourceData.live_photo) && sourceData.live_photo.length > 0) {
    result.livePhotos = sourceData.live_photo.map(item => ({
      image: item.image,
      video: item.video
    }))
    
    if (!result.videoUrl && sourceData.live_photo[0] && sourceData.live_photo[0].video) {
      result.videoUrl = sourceData.live_photo[0].video
    }
    
    if ((!result.images || result.images.length === 0) && sourceData.live_photo[0]) {
      result.images = sourceData.live_photo.map(item => item.image).filter(img => img)
    }
  }

  if (sourceData.music && typeof sourceData.music === 'object') {
    result.music = {
      title: sourceData.music.title,
      author: sourceData.music.author,
      url: sourceData.music.url,
      cover: sourceData.music.cover
    }
  }

  const hasContent = result.videoUrl || 
                     (result.images && result.images.length > 0) || 
                     (result.livePhotos && result.livePhotos.length > 0)

  if (!hasContent) {
    throw new Error('返回数据为空或无法识别内容类型')
  }

  console.log('[解析完成]', {
    type: result.type,
    hasVideo: !!result.videoUrl,
    imagesCount: result.images ? result.images.length : 0,
    livePhotosCount: result.livePhotos ? result.livePhotos.length : 0,
    hasMusic: !!result.music,
    title: result.title?.substring(0, 50),
    author: result.author
  })

  return result
}

async function useJkApi(url) {
  try {
    const apiUrl = `https://api-jksb.jkapi.com/douyin?url=${encodeURIComponent(url)}`
    const response = await fetchWithRetry(apiUrl)

    if (response.data && (response.data.code === 200 || response.data.url)) {
      return parseApiResponse(response.data, 'unknown')
    }

    throw new Error(response.data?.msg || '解析失败')
  } catch (error) {
    console.error('[JK API] 失败:', error)
    throw error
  }
}

async function useIpaybuyApi(url) {
  try {
    const apiUrl = `https://qyapi.ipaybuy.cn/api/video?url=${encodeURIComponent(url)}`
    const response = await fetchWithRetry(apiUrl)

    if (response.data && response.data.code === 200) {
      const data = response.data.data || response.data
      return parseApiResponse(data, 'unknown')
    }

    throw new Error(response.data?.msg || '解析失败')
  } catch (error) {
    console.error('[IPAYBUY API] 失败:', error)
    throw error
  }
}

export async function removeXiaohongshuWatermark(url) {
  console.log('\n[小红书] 开始处理:', url)

  const apis = [
    () => useBugpkXhsApi(url),
    () => use317akApi(url, 'xiaohongshu'),
    useJkApi,
    useIpaybuyApi
  ]

  for (const apiFunc of apis) {
    try {
      const result = await apiFunc(url)
      result.platform = 'xiaohongshu'
      console.log('[小红书] ✅ 成功')
      return result
    } catch (error) {
      console.warn(`[小红书] ❌ ${apiFunc.name || 'API'} 失败:`, error.message)
      continue
    }
  }

  console.log('[小红书] 所有API都失败了')
  return {
    success: false,
    error: '小红书去水印失败，请检查链接是否正确或稍后重试。提示：如果链接来自APP，请在浏览器中打开后再复制链接。',
    fallbackUrl: url.replace(/\/explore\//, '/discovery/item/')
  }
}

export async function removeWeiboWatermark(url) {
  console.log('\n[微博] 开始处理:', url)

  const apis = [
    () => useBugpkWeiboApi(url),
    () => use317akApi(url, 'weibo'),
    useJkApi,
    useIpaybuyApi
  ]

  for (const apiFunc of apis) {
    try {
      const result = await apiFunc(url)
      result.platform = 'weibo'
      console.log('[微博] ✅ 成功')
      return result
    } catch (error) {
      console.warn(`[微博] ❌ ${apiFunc.name || 'API'} 失败:`, error.message)
      continue
    }
  }

  console.log('[微博] 所有API都失败了')
  return {
    success: false,
    error: '微博去水印失败，请检查链接是否正确或稍后重试'
  }
}

export async function removeDouyinWatermark(url) {
  console.log('\n[抖音] 开始处理:', url)
  
  const apis = [
    () => useBugpkDouyinApi(url),
    () => use317akApi(url, 'douyin'),
    useJkApi,
    useIpaybuyApi
  ]

  for (const apiFunc of apis) {
    try {
      const result = await apiFunc(url)
      result.platform = 'douyin'
      console.log('[抖音] ✅ 成功')
      return result
    } catch (error) {
      console.warn(`[抖音] ❌ ${apiFunc.name || 'API'} 失败:`, error.message)
      continue
    }
  }

  const cleanUrl = url
    .replace(/www\.douyin\.com/, 'aweme.snssdk.com')
    .replace(/video\//, 'aweme/v1/play/?video_id=')

  console.log('[抖音] 所有API都失败了')
  return {
    success: false,
    error: '抖音去水印失败，请检查链接是否正确或稍后重试。提示：请使用分享功能复制链接，而不是直接复制地址栏。',
    fallbackUrl: cleanUrl
  }
}

export async function removeKuaishouWatermark(url) {
  console.log('\n[快手] 开始处理:', url)

  const apis = [
    () => useBugpkKuaishouApi(url),
    () => use317akApi(url, 'kuaishou'),
    useJkApi,
    useIpaybuyApi
  ]

  for (const apiFunc of apis) {
    try {
      const result = await apiFunc(url)
      result.platform = 'kuaishou'
      console.log('[快手] ✅ 成功')
      return result
    } catch (error) {
      console.warn(`[快手] ❌ ${apiFunc.name || 'API'} 失败:`, error.message)
      continue
    }
  }

  console.log('[快手] 所有API都失败了')
  return {
    success: false,
    error: '快手去水印失败，请检查链接是否正确或稍后重试'
  }
}

export async function removeDoubaoWatermark(url) {
  console.log('\n[豆包] 开始处理:', url)

  const apis = [
    () => useBugpkDoubaoApi(url),
    () => use317akApi(url, 'doubao'),
    useJkApi,
    useIpaybuyApi
  ]

  for (const apiFunc of apis) {
    try {
      const result = await apiFunc(url)
      result.platform = 'doubao'
      console.log('[豆包] ✅ 成功')
      return result
    } catch (error) {
      console.warn(`[豆包] ❌ ${apiFunc.name || 'API'} 失败:`, error.message)
      continue
    }
  }

  console.log('[豆包] 所有API都失败了')
  return {
    success: false,
    error: '豆包内容提取失败，请检查链接是否正确或稍后重试'
  }
}

function extractImagesFromContent(htmlContent) {
  if (!htmlContent) return []
  
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  const images = []
  let match
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    images.push(match[1])
  }
  
  return images
}

export async function removeWatermark(url, platform) {
  console.log('\n========== 开始去水印 ==========')
  console.log('平台:', platform)
  console.log('URL:', url)
  
  try {
    let result
    
    switch (platform) {
      case 'xiaohongshu':
        result = await removeXiaohongshuWatermark(url)
        break
      case 'weibo':
        result = await removeWeiboWatermark(url)
        break
      case 'douyin':
        result = await removeDouyinWatermark(url)
        break
      case 'kuaishou':
        result = await removeKuaishouWatermark(url)
        break
      case 'doubao':
        result = await removeDoubaoWatermark(url)
        break
      default:
        result = {
          success: false,
          error: '不支持的平台'
        }
    }

    console.log('========== 最终结果 ==========')
    console.log(JSON.stringify(result, null, 2))

    return result
  } catch (error) {
    console.error('========== 处理异常 ==========')
    console.error(error)
    
    return {
      success: false,
      error: '处理过程中发生错误: ' + error.message
    }
  }
}

export { searchNeteaseMusic }
