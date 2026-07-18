# Agent Workflow & Project Memories

本文档记录了 `tools` 项目的开发规范、关键架构决策以及重要的环境配置记忆。无论是新建工具、调试错误还是重构代码，请务必参考以下规范。

## 1. 架构与环境配置 (Architecture & Environment)
- **核心框架**: 采用 **Astro** 框架，并配置了 `@astrojs/cloudflare` 适配器以支持 SSR (Server-Side Rendering)，使项目能够直接在 Cloudflare Pages 及 Workers 上运行 API。
- **Node.js 版本**: 项目严格依赖 **Node.js >= 24.0.0**，已在根目录配置 `.node-version`。
- **依赖冲突规避 (重要)**: 由于 `@astrojs/cloudflare` 对 `astro` 的 Peer Dependency 限制，Astro 版本被锁定在 `^5.0.0`。在安装新依赖时务必注意，避免盲目升级导致 Cloudflare CI 环境 `npm install` 报 `ERESOLVE` 错误。

## 2. 界面设计语言 (UI/UX Aesthetics)
- **视觉风格**: 全局采用现代化、高级的 **Glassmorphism (毛玻璃)** 和深色模式设计。
- **背景特效**: 页面必须保留 `background-elements` 和 `glow-orb` 实现动态发光的光球背景。
- **页面排版规范 (参考 Base64 / Sing-Box)**:
  - 顶部的 `<header>` 必须保持极简，**仅包含纯文本**：带有渐变 `highlight` 的大标题 `<h1>` 和一段 `<p>` 描述，**严禁在 Header 区域放置操作按钮**。
  - 操作区域必须使用 `<main class="tool-interface">` 容器包裹。
  - 内部模块使用 `.panel` 卡片样式。
  - 所有的交互按钮（如打开、保存、转换等）必须内嵌在工作区的 `.panel-header` 或 `.toolbar` 内，以保证页面顶部的纯净视觉体验。
  - 按钮样式统一使用预设的 `.btn.primary`、`.btn.secondary` 或透明无边框的 `.icon-btn`，**避免使用高饱和度的实色大色块 (如纯绿/纯橙)**。

## 3. 版本发布管理 (Release & Versioning)
- 项目未发布到 NPM 官方仓库，而是作为一个私有 Web 项目存在。
- 版本号管理和 Tag 生成统一使用 `release-it` 工具。
- **执行规范**: 必须使用 `npx release-it patch --ci --no-npm` 来绕过 NPM 的发布检查，专门利用其修改 `package.json` 版本并自动推送 Git Tag 到 GitHub。

## 4. API 接口开发规范 (API Routes)
- **路由位置**: 后端接口统一存放在 `src/pages/api/` 目录下（如 `ping.ts`）。
- **安全验证**: 对于需要保护的 API，必须实现 API Key 认证机制。
  - 读取优先级：优先读取 Cloudflare 的 `locals.runtime.env.API_KEY`，回退读取本地 `import.meta.env.API_KEY`。
  - 请求校验：必须校验 Header 中的 `Authorization: Bearer <key>` 或 `X-API-Key: <key>`。
  - 环境配置：线上密码通过 Cloudflare Pages 的 Variables and Secrets 进行配置，每次修改环境变量后**必须 Retry Deployment** 才会生效。
