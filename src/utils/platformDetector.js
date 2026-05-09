const platformPatterns = {
  xiaohongshu: {
    name: '小红书',
    icon: '📕',
    color: '#FF2442',
    patterns: [/xiaohongshu\.com/, /xhslink\.com/]
  },
  weibo: {
    name: '微博',
    icon: '📱',
    color: '#E6162D',
    patterns: [/weibo\.com/, /weibo\.cn/]
  },
  douyin: {
    name: '抖音',
    icon: '🎵',
    color: '#000000',
    patterns: [/douyin\.com/, /iesdouyin\.com/]
  },
  kuaishou: {
    name: '快手',
    icon: '⚡',
    color: '#FF4906',
    patterns: [/kuaishou\.com/, /gifshow\.com/]
  },
  doubao: {
    name: '豆包',
    icon: '🤖',
    color: '#0066FF',
    patterns: [/doubao\.com/, /juejin\.cn/]
  }
}

export function detectPlatform(url) {
  if (!url) return null
  
  const lowerUrl = url.toLowerCase()
  
  for (const [platformKey, platformInfo] of Object.entries(platformPatterns)) {
    for (const pattern of platformInfo.patterns) {
      if (pattern.test(lowerUrl)) {
        return {
          key: platformKey,
          ...platformInfo
        }
      }
    }
  }
  
  return null
}

export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function extractVideoId(url, platform) {
  const patterns = {
    xiaohongshu: [/explore\/([^/?#]+)/, /discovery\/item\/([^/?#]+)/],
    weibo: [/(\d+)/],
    douyin: [/video\/([^/?#]+)/, /note\/([^/?#]+)/],
    kuaishou: [/short-video\/([^/?#]+)/, /photo\/([^/?#]+)/],
    doubao: [/post\/([a-zA-Z0-9-]+)/]
  }

  if (patterns[platform]) {
    for (const pattern of patterns[platform]) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
  }
  
  return null
}

export const platforms = platformPatterns
