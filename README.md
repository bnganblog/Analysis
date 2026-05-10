# 多平台去水印工具

一个基于 Vue 3 + Vite 构建的多平台视频/图文去水印工具，支持小红书、微博、抖音、快手、豆包等主流平台。

## ✨ 功能特性

- 🎬 **多平台支持**：支持小红书、微博、抖音、快手、豆包等主流平台
- 🎨 **现代UI设计**：简洁美观的用户界面，支持浅色/暗色主题切换
- 📱 **响应式布局**：完美适配桌面端和移动端设备
- 🎵 **音乐搜索**：支持网易云音乐歌曲搜索、歌词获取和下载
- 🖼️ **多媒体支持**：支持视频、图片、实况照片、背景音乐等多种媒体类型
- ⚡ **快速解析**：优化的API调用策略，提供快速稳定的内容解析
- 🌐 **浏览器兼容**：支持主流浏览器，包括Chrome、Firefox、Safari等

## 🚀 在线演示

访问地址：[https://analysis.hao006.xyz](https://analysis.hao006.xyz)

## 📦 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite
- **HTTP客户端**：Axios
- **UI组件**：Element Plus
- **浏览器兼容**：@vitejs/plugin-legacy

## 🛠️ 安装与运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📖 使用说明

### 去水印功能

1. 复制视频或图文链接（支持小红书、微博、抖音、快手、豆包等）
2. 粘贴到输入框中，系统会自动识别平台
3. 点击"解析处理"按钮
4. 等待解析完成，即可下载无水印的视频或图片

### 音乐搜索功能

1. 切换到"音乐搜索"标签页
2. 输入网易云音乐歌曲ID
3. 选择操作类型（歌曲详情、获取歌词、下载音乐）
4. 点击"查询"按钮获取结果

## 🎯 支持的平台

| 平台 | 支持内容 | 状态 |
|------|---------|------|
| 小红书 | 视频、图片、实况照片 | ✅ |
| 微博 | 视频、图片 | ✅ |
| 抖音 | 视频 | ✅ |
| 快手 | 视频 | ✅ |
| 豆包 | 视频 | ✅ |

## 📱 浏览器兼容性

- Chrome >= 61
- Firefox >= 60
- Safari >= 12
- Edge >= 16
- iOS Safari >= 12

## 🔧 配置说明

### Vite 配置

项目使用 `@vitejs/plugin-legacy` 插件提供旧版浏览器支持，默认配置支持 iOS >= 12。

### 部署配置

项目配置了 GitHub Pages 自动部署，运行以下命令即可部署：

```bash
npm run build
npm run deploy
```

## 📝 更新日志

### v1.0.0 (2024-2026)

- ✨ 初始版本发布
- 🎨 支持浅色/暗色主题
- 🚀 支持多平台解析
- 🎵 添加音乐搜索功能
- 📱 优化移动端体验
- 🐛 修复Safari浏览器兼容性问题

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目仅供学习和研究使用，请勿用于商业用途。

## 👤 作者

**Bngan**

- 网站：[https://analysis.hao006.xyz](https://analysis.hao006.xyz)
- GitHub：[https://github.com/bnganblog](https://github.com/bnganblog)

## 🙏 致谢

感谢所有开源项目的贡献者，本项目使用了以下开源项目：

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/)
- [Axios](https://axios-http.com/)

---

Made with ❤️ by Bngan
