# 甜蜜恋爱记录小窝 💞

> 温馨治愈的情侣记录应用：日常随记、纪念日倒数、心愿清单、回忆相册、恋爱 100 件小事打卡、情侣互动问答，一应俱全。

## 项目简介

**甜蜜恋爱记录小窝**是一个面向情侣两人的全栈 Web 应用，用来共同记录恋爱的点点滴滴。两人可以在同一个应用里写日记、倒数纪念日、许心愿、打卡"恋爱 100 件小事"、回答情侣话题问答，并自由定制界面的主题风格。数据全部保存在自己的 PostgreSQL 数据库中，支持桌面端与移动端访问。

## 功能一览

| 模块 | 说明 |
| --- | --- |
| 🏠 首页 | 情侣资料卡（头像、恋爱宣言）、在一起天数统计、最近的纪念日倒计时、今日话题、快捷入口 |
| 📖 恋爱日常 | 图文日记：标题、正文、心情（兴奋/甜蜜/开心/搞怪/平静）、天气、地点、作者、多张照片 |
| 🎉 纪念日 | 支持每年/每月/单次三种重复类型，图标、备注、置顶，自动计算倒计时和进度条 |
| ⭐ 心愿清单 | 按分类（旅行/娱乐/美食/浪漫/生活）许愿，完成后可记录完成日期、感想和照片 |
| 🖼️ 回忆相册 | 照片 + 标题 + 说明 + 日期 + 标签的相册墙 |
| ✅ 100 件恋爱小事 | 内置 100 条打卡清单（一起看日出、摩天轮许愿、写手写信……），分类筛选、总达成度进度条、每项可写备注 |
| 💬 情侣问答 | 两人分别回答同一个话题（分类：甜蜜回忆/深度灵魂/脑洞奇想/浪漫未来/日常温情），可收藏、可自定义话题 |
| 🎨 主题换肤 | 4 套预设主题（暖阳奶油/樱落粉梦/极夜星河/森林薄荷），还可自定义主色、背景色、描边色、字体（4 种）、背景纹理（5 种）和背景图片 |
| 📅 年度回忆账单 | 一键汇总这一年的日记、纪念日、心愿与打卡，支持复制/打印/下载/分享 |
| 📱 小程序预览模式 | 以微信小程序的手机壳外观模拟展示应用 |
| 📲 移动端适配 | 桌面端顶部导航，移动端底部标签栏 |

首次启动时，如果数据库为空，服务端会自动写入一套示例数据（"呆呆 & 圆圆"的演示日记、纪念日、心愿、话题等），方便直接体验效果；之后可在应用内随意修改或删除。

## 技术栈

- **前端**：React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + lucide-react（图标）+ motion（动画）
- **后端**：Node.js + Express（同一进程内同时提供 REST API 和前端静态资源）
- **数据库**：PostgreSQL + Drizzle ORM（类型安全的表结构与查询），drizzle-kit 管理表结构
- **鉴权**：Firebase Authentication（客户端 SDK + Admin SDK），当前所有接口为可选鉴权，即匿名也可读写

> 说明：项目源自 Google AI Studio 应用模板，`.env.example` 中的 `GEMINI_API_KEY`、`APP_URL` 以及 `@google/genai` 依赖为模板自带，当前代码并未调用 Gemini 接口，可忽略。

## 项目结构

```
falling-in-love/
├── server.ts                  # Express 服务端：REST API + 数据初始化 + 静态资源
├── index.html                 # 前端入口 HTML
├── vite.config.ts             # Vite 配置（React + Tailwind 插件）
├── drizzle.config.ts 位于 src/db/drizzle.config.ts
├── firebase-applet-config.json# Firebase 前端配置
├── .env.example               # 环境变量示例
├── public/assets/             # 演示图片等静态资源
└── src/
    ├── main.tsx / App.tsx     # 前端入口、路由与全局状态
    ├── types.ts               # 前后端共享的 TypeScript 类型
    ├── components/            # 各功能视图与弹窗组件
    ├── middleware/auth.ts     # Firebase 鉴权中间件（可选/强制两种）
    ├── lib/                   # Firebase 客户端与管理端初始化
    ├── utils/                 # 日期计算、主题、预设头像等工具
    └── db/
        ├── schema.ts          # Drizzle 表结构定义（7 张表）
        ├── index.ts           # 数据库连接池
        ├── drizzle.config.ts  # drizzle-kit 配置
        ├── seedData.ts        # 100 件恋爱小事种子数据
        └── topicsData.ts      # 情侣问答种子数据
```

## 快速开始

### 环境要求

- Node.js ≥ 20（推荐用 [Bun](https://bun.sh) 安装依赖，仓库自带 `bun.lock`）
- 一个可连接的 PostgreSQL 数据库

### 1. 配置环境变量

复制示例文件并按实际情况填写：

```bash
cp .env.example .env
```

运行服务端必需的变量（`server.ts` 与 `src/db/index.ts` 读取）：

| 变量 | 说明 |
| --- | --- |
| `SQL_HOST` | PostgreSQL 主机地址，如 `127.0.0.1` |
| `SQL_USER` | 数据库用户名 |
| `SQL_PASSWORD` | 数据库密码 |
| `SQL_DB_NAME` | 数据库名，如 `falling_in_love` |

执行 drizzle-kit 同步表结构时，还需要（`src/db/drizzle.config.ts` 读取）：

| 变量 | 说明 |
| --- | --- |
| `SQL_ADMIN_USER` | 有建表权限的用户名（可与上面相同） |
| `SQL_ADMIN_PASSWORD` | 对应密码 |

> `GEMINI_API_KEY`、`APP_URL` 为 AI Studio 模板遗留，本地运行无需配置。

### 2. 初始化数据库

先创建好数据库（以本地为例）：

```bash
createdb falling_in_love
# 或在 psql 中执行：CREATE DATABASE falling_in_love;
```

然后把 Drizzle 表结构推送到数据库：

```bash
npx drizzle-kit push
# 或使用 bun：bunx drizzle-kit push
```

这会自动创建 7 张表：`couple_profile`（情侣资料与主题）、`couple_topics`（情侣问答）、`diaries`（日记）、`anniversaries`（纪念日）、`wishes`（心愿）、`checklists`（100 件小事）、`memories`（回忆相册）。

### 3. 安装依赖

```bash
bun install
# 或
npm install
```

### 4. 启动开发服务

```bash
bun run dev
# 或
npm run dev
```

启动后访问 **http://localhost:3000**（服务监听 `0.0.0.0:3000`）。开发模式下 Express 通过 Vite 中间件实时渲染前端，支持热更新；首次启动会自动灌入示例数据。

## 生产部署

```bash
# 1. 构建前端产物到 dist/
npm run build

# 2. 以生产模式启动（改为托管 dist/ 静态文件，不再走 Vite）
NODE_ENV=production npm start
```

建议用 pm2、systemd 或 Docker 等方式守护进程，并确保 `.env` 中的数据库连接信息正确。

## 使用说明

1. **首次进入**：看到的是示例数据。点击右上角 **设置（齿轮）**，修改小窝名称、两人昵称与头像（预设了修勾/猫咪/小兔等 6 种可爱头像）、在一起的日期、恋爱宣言。
2. **换主题**：点击导航栏的 **调色板** 图标，选择预设主题或自定义颜色、字体、背景纹理，甚至上传背景图。
3. **写日记**：进入"日常"标签 → 新建日记，填写标题、正文，选择心情和天气，附上照片、地点。
4. **加纪念日**：进入"纪念日"标签，填写名称与日期，选择每年/每月/单次重复，可置顶最重要的那个；首页会自动显示最近的倒计时。
5. **许愿**：在"心愿"标签添加愿望并设定目标日期；完成时点"达成"，记录完成日期、感想和照片。
6. **打卡 100 件小事**：在"打卡"标签按分类浏览，完成一项就勾选并可写备注，顶部实时显示总达成度。
7. **情侣问答**：在"问答"标签，两人分别写下自己对同一话题的回答，可以收藏喜欢的话题，也可以自定义新话题。
8. **年度回忆**：在设置弹窗里打开"年度回忆账单"，一键生成本年总结，可打印或保存分享。
9. **手机访问**：用手机浏览器打开同一地址即可获得底部标签栏的移动端布局；桌面端也可切换"小程序预览模式"提前预览效果。

## API 一览

前后端共用以下 REST 接口（均返回 JSON）：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET / PUT | `/api/profile` | 读取/更新情侣资料与主题配置 |
| GET / POST | `/api/topics` | 获取全部问答 / 新增话题 |
| PUT / DELETE | `/api/topics/:id` | 更新（双方回答、收藏）/ 删除话题 |
| GET / POST | `/api/diaries` | 日志列表 / 新建日记 |
| PUT / DELETE | `/api/diaries/:id` | 更新 / 删除日记 |
| GET / POST | `/api/anniversaries` | 纪念日列表 / 新增 |
| PUT / DELETE | `/api/anniversaries/:id` | 更新 / 删除纪念日 |
| GET / POST | `/api/wishes` | 心愿列表 / 新增 |
| PUT / DELETE | `/api/wishes/:id` | 更新 / 删除心愿 |
| GET | `/api/checklists` | 100 件小事列表 |
| PUT | `/api/checklists/:id` | 更新打卡状态、备注、照片 |
| GET / POST | `/api/memories` | 回忆列表 / 新增 |
| DELETE | `/api/memories/:id` | 删除回忆 |

写操作路由挂载了 `optionalAuth` 中间件：请求带 `Authorization: Bearer <Firebase ID Token>` 时会校验身份，不带或校验失败则按匿名继续处理，因此本地单人使用无需登录。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发模式启动（Express + Vite 中间件，端口 3000） |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm start` | 启动服务（生产模式下托管 `dist/`） |
| `npm run lint` | TypeScript 类型检查 |
| `npm run clean` | 清理 `dist/` 等构建产物 |

## 常见问题

- **页面打不开、接口报 500**：先确认 PostgreSQL 已启动、`.env` 四个 `SQL_*` 变量正确，且已执行 `npx drizzle-kit push` 建表。
- **想要自己的数据而非示例数据**：示例数据只在数据库为空时写入一次，直接在界面里编辑或删除即可；如需彻底重来，清空对应数据表后重启。
- **想启用真正的登录鉴权**：把 `firebase-applet-config.json` 换成自己的 Firebase 项目配置，并在 `server.ts` 中把需要保护的接口的 `optionalAuth` 换成 `requireAuth`（见 `src/middleware/auth.ts`）。
- **端口被占用**：服务端口固定为 3000（`server.ts` 中的 `port` 变量），可自行修改。
