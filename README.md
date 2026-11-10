# 尿液 pH 记录 · PWA

一个纯前端、离线可用的尿液 pH 记录小应用。数据只存在设备本地，不上传任何服务器。

## 文件

| 文件 | 作用 |
|---|---|
| `index.html` | 应用本体（全部逻辑在这一个文件里） |
| `manifest.webmanifest` | PWA 清单：名称、图标、独立窗口模式 |
| `sw.js` | Service Worker：离线缓存 |
| `icon-192.png` / `icon-512.png` | 标准图标 |
| `icon-maskable-512.png` | Android 自适应图标（内容已缩进安全区） |
| `apple-touch-icon.png` | iOS 主屏幕图标（180×180） |
| `make_icons.py` | 图标生成脚本（改配色后重跑即可，部署时可不上传） |

## 部署（任选一种，都是免费的）

### 方式 A：Cloudflare Pages（最快，约 3 分钟）

1. 打开 https://dash.cloudflare.com/ → 注册/登录
2. 左侧 **Workers & Pages** → **Create** → **Pages** → **Upload assets**
3. 项目名随便起（比如 `ph-tracker`）
4. 把本文件夹**所有文件**拖进去 → **Deploy**
5. 拿到网址 `https://ph-tracker.pages.dev`

> ⚠️ 国内访问 `*.pages.dev` 有时偏慢。但**装一次之后离线可用**，所以只要能打开一次就行。

### 方式 B：GitHub Pages

1. 在 GitHub 新建一个 public 仓库
2. 把本文件夹内容推到 `main` 分支
3. 仓库 **Settings → Pages → Source: Deploy from a branch → main / (root)**
4. 网址是 `https://<用户名>.github.io/<仓库名>/`

### 方式 C：自己的 NAS（国内最快，需已能从外网访问）

1. DSM → **Web Station** → 新建虚拟主机（或直接放到 web 共享文件夹）
2. 把文件放进去
3. 在 **控制面板 → 登录门户 → 高级 → 反向代理** 或 Web Station 里绑定你的域名 + Let's Encrypt 证书
4. 用 `https://你的域名/` 访问

> ✅ 这个方案国内速度最好，且数据完全在自己手里。前提是 NAS 的 HTTPS 已能从外网打开。

## 安装到手机主屏幕

### iOS（Safari）
打开网址 → 底部 **分享** 按钮 → **添加到主屏幕** → 添加

### Android（Chrome）
打开网址 → 右上角 **⋮** → **添加到主屏幕 / 安装应用**

装好后桌面会出现图标，点开是全屏、没有地址栏，和原生 App 一样。

## 更新代码后怎么办

改完 `index.html` 等文件后，**必须把 `sw.js` 里的 `VERSION` 加 1**（比如 `ph-v4` → `ph-v5`），
否则手机上会一直用旧缓存。

然后重新上传部署。手机上打开一次，第二次打开就是新版。

如果急着看新版：把 App 从后台彻底划掉再打开，或者清除该站点的数据。

## 数据结构

存在 `localStorage` 的 `urine_ph_v2` 键下：

```json
[{"ts":1794320881997,"day":"2026-11-10","time":"22:28","seg":"wake","ph":5.5}]
```

- `seg` 取值：`wake` 晨起 / `am` 上午 / `lunchb` 午饭前 / `luncha` 午饭后 / `pm` 下午 / `dinnerb` 晚饭前 / `bed` 睡前 / `night` 起夜

## 判读规则（写在代码里的）

| 范围 | 显示 |
|---|---|
| 6.2 ~ 6.5 | ✅ 绿 |
| > 6.5 | 🔴 红（>7.0 尤其注意） |
| < 6.2 | 🟠 橙 |

尿酸结石目标区间按 6.2~6.5 设定（上限留出安全余量，避免长期 >6.8 的磷酸钙风险）。
