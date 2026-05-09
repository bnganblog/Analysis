import { detectPlatform } from './src/utils/platformDetector.js'
import { removeWatermark } from './src/services/watermarkService.js'

const testUrl = 'https://www.douyin.com/video/7637434028307615014'

console.log('========== 测试开始 ==========')
console.log('测试链接:', testUrl)

const platform = detectPlatform(testUrl)
console.log('检测到平台:', platform)

if (platform) {
  console.log('\n开始调用去水印API...')
  
  try {
    const result = await removeWatermark(testUrl, platform.key)
    
    console.log('\n========== API 返回结果 ==========')
    console.log(JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('\n✅ 解析成功！')
      console.log('- 内容类型:', result.type)
      console.log('- 标题:', result.title)
      console.log('- 作者:', result.author)
      console.log('- 有视频:', !!result.videoUrl)
      console.log('- 图片数量:', result.images?.length || 0)
      console.log('- 实况照片:', result.livePhotos?.length || 0)
      console.log('- 背景音乐:', result.music ? '有' : '无')
      
      if (result.videoUrl) {
        console.log('\n📹 视频链接:', result.videoUrl.substring(0, 80) + '...')
      }
      
      if (result.images && result.images.length > 0) {
        console.log('🖼️ 第一张图片:', result.images[0].substring(0, 80) + '...')
      }
      
      if (result.livePhotos && result.livePhotos.length > 0) {
        console.log('📸 实况照片数量:', result.livePhotos.length)
        console.log('   第一个视频:', result.livePhotos[0]?.video?.substring(0, 80) + '...')
      }
      
      if (result.music) {
        console.log('🎵 音乐信息:')
        console.log('   - 标题:', result.music.title)
        console.log('   - 歌手:', result.music.author)
        console.log('   - 链接:', result.music.url?.substring(0, 60) + '...')
      }
    } else {
      console.log('\n❌ 解析失败:', result.error)
    }
    
  } catch (error) {
    console.error('\n❌ 发生错误:', error.message)
  }
} else {
  console.log('❌ 无法识别平台')
}

console.log('\n========== 测试结束 ==========')
