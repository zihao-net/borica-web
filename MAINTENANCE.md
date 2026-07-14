# 博瑞卡官网维护手册

> 适用对象：非技术人员
> 更新方式：修改 Markdown 文件 → git push → 自动部署

不需要懂代码。所有内容都是 Markdown 文件（类似 Word 文档），改完同步到线上即可。

---

## 目录

1. [本地运行](#1-本地运行)
2. [修改公司信息（电话、地址、邮箱等）](#2-修改公司信息电话地址邮箱等)
3. [修改导航菜单和按钮文字](#3-修改导航菜单和按钮文字)
4. [修改产品信息](#4-修改产品信息)
5. [修改解决方案](#5-修改解决方案)
6. [修改客户案例](#6-修改客户案例)
7. [替换产品图片](#7-替换产品图片)
8. [修改静态页面内容（关于我们/服务/联系）](#8-修改静态页面内容关于我们服务联系)
9. [构建和部署](#9-构建和部署)
10. [常见问题](#10-常见问题)

---

## 1. 本地运行

### 预览网站

```bash
npm run dev
```

浏览器打开 `http://localhost:4321` 即可看到网站。改文件后浏览器会自动刷新，不需要手动刷新。

### 检查是否有错误

```bash
npm run build
```

看到 `Complete!` 表示没有错误，可以部署。看到红色的 `error` 表示有问题，需要修复。

---

## 2. 修改公司信息（电话、地址、邮箱等）

只需修改一个文件，中英文同时生效：

**文件**: `src/lib/constants.ts`

```ts
export const COMPANY = {
  name: '博瑞卡（无锡）自动化科技有限公司',    // 中文公司全称
  nameEn: 'Borica (Wuxi) Automation Technology Co., Ltd.',  // 英文公司全称
  shortName: '博瑞卡',                         // 中文简称
  shortNameEn: 'Borica',                      // 英文简称
  tagline: '食品供料，就找博瑞卡',              // 中文口号
  taglineEn: 'Borica: Smart Food Feeding Solutions',  // 英文口号
  phone: '0510-85166119',                     // 电话
  email: 'info@boricatec.com',                // 邮箱
  whatsapp: '8618861527881',                  // WhatsApp 号码（不含+号）
  wechat: 'BoricaTech',                       // 微信号
  address: '江苏省无锡市新吴区长江东路229号',    // 中文地址
  addressEn: 'No.229 East Changjiang Road, Xinwu District, Wuxi, Jiangsu, China',  // 英文地址
  domain: 'www.boricatec.com',                // 域名
  founded: 2023,                              // 成立年份
};
```

**改法**：直接改双引号里的内容即可。改完跑 `npm run build` 确认无报错。

---

## 3. 修改导航菜单和按钮文字

导航、按钮、页面标题等文字分中英文两个文件：

- **中文**: `src/i18n/zh.ts`
- **英文**: `src/i18n/en.ts`

两个文件结构完全一样，对照着改即可。

### 例子：修改「联系我们」为「联络我们」

打开 `src/i18n/zh.ts`，找到 `contact: '联系我们'`，改成 `contact: '联络我们'`。

英文版在 `src/i18n/en.ts`，找到 `contact: 'Contact'`，改对应处。

### 增加产品分类

在 `products.categories` 部分，中英文同步添加一个条目：

```ts
// zh.ts 中加中文名
categories: {
  all: '全部',
  forming: '成型设备',
  // 在这里加一行，比如：
  newCategory: '新分类名',
}

// en.ts 中加英文名
categories: {
  all: 'All',
  forming: 'Forming Machines',
  // 加对应英文：
  newCategory: 'New Category Name',
}
```

---

## 4. 修改产品信息

产品内容在 `src/content/products/` 目录，每种产品一个 .md 文件：

```
中文版：src/content/products/zh/产品名.md
英文版：src/content/products/en/产品名.md
```

**必须在两个文件都做相同修改**，否则中英文会不一致。

### 文件结构说明

```markdown
---
title: 实心丸子机          ← 产品名称
model: BRK-SC08           ← 型号
category: forming         ← 分类（forming/filling/cleaning/automation/cnc/safety）
featured: true            ← 是否在首页展示（true/false）
order: 1                  ← 排序（数字越小越靠前）
heroImage: /images/products/xxx.png  ← 主图路径
specs:                    ← 技术参数表格
  - label: 最大生产速度
    value: 2800粒/分
  - label: 克重误差
    value: ±0.5-1g
features:                 ← 产品特性列表
  - 产能效率高，最大生产速度2800粒/分
  - 产品质量稳定，外观一致性好
---

这里是产品描述的正文，支持 Markdown 格式。可以写多段文字。
```

### 修改参数

找到对应 `label` 和 `value`，直接改 `value` 后的内容即可。

### 添加/删除参数

- **添加**: 在 `specs:` 下面新增一行 `- label: 参数名` 和 `value: 参数值`
- **删除**: 删掉整个 `- label:` 到 `value:` 两行

### 常见产品对照表

| 文件名 | 产品 | 型号 |
|--------|------|------|
| brk-sc08 | 实心丸子机 | BRK-SC08 |
| brk-bc08 | 包心丸子机 | BRK-BC08 |
| brk-sc05 | 大丸子成型机 | BRK-SC05 |
| brk-yp6 | 饼类成型机 | BRK-YP6 |
| cleaning-system | 高压清洗系统 | BRK-CS |
| automation-line | 自动化产线 | BRK-AR |
| cnc-machining | CNC精密加工 | BRK-CNC |
| water-mist | 细水雾抑爆系统 | BRK-WM |

---

## 5. 修改解决方案

解决方案在 `src/content/solutions/` 目录：

```
中文版：src/content/solutions/zh/方案名.md
英文版：src/content/solutions/en/方案名.md
```

结构类似产品，有 `highlights`（亮点）、`specs`（参数）和 Markdown 正文。

### 解决方案对照表

| 文件名 | 方案 |
|--------|------|
| filling-system | 自动加馅系统 |
| dough-system | 自动加面系统 |
| forming | 成型设备 |
| cleaning | 清洗系统 |
| automation | 产线自动化 |

---

## 6. 修改客户案例

案例在 `src/content/caseStudies/` 目录：

```
中文版：src/content/caseStudies/zh/synear-food.md
英文版：src/content/caseStudies/en/synear-food.md
```

结构包含 `challenge`（客户挑战）、`solution`（我们的方案）、`results`（成果数据）。

### 修改成果数据

```yaml
results:
  - metric: 减少人工        ← 指标名称
    value: 6-9人           ← 指标数值
```

### 修改挑战和方案描述

`challenge` 和 `solution` 字段的内容是长文本，在 `|---` 标记之间直接写文字即可。

---

## 7. 替换产品图片

### 图片存放位置

所有图片放在 `public/images/` 目录：

```
public/images/
├── logo.png                    # 主 logo
├── logo-white.png              # 白色 logo（深色背景用）
├── company/
│   └── cnc-workshop.png        # 车间照片
├── products/                   # 产品图片
│   ├── brk-sc08.png
│   ├── brk-bc08.png
│   └── ...
└── solutions/                  # 方案图片
    ├── filling-system-overview.png
    └── ...
```

### 替换步骤

1. 准备好新图片，推荐尺寸：产品图 800×600px，横幅图 1200×600px
2. 推荐格式：WebP（体积小）或 PNG/JPG
3. 将图片放到 `public/images/products/` 目录（或对应子目录）
4. 打开产品对应的 .md 文件，修改 `heroImage` 字段：

```yaml
heroImage: /images/products/你的新图片文件名.png
```

5. 中英文两个 .md 文件的 `heroImage` 都指向同一个图片路径，只需改一次图片文件，中英文都会更新。

---

## 8. 修改静态页面内容（关于我们/服务/联系）

这些页面的整体框架在 `src/pages/` 下，由 Astro 组件构成。普通内容修改不需要动这些文件。

**例外情况**：如果你需要修改页面上的固定文案（不是从 i18n 字典读取的文字），需要直接改对应 .astro 文件。

**建议**：尽量把文字放到 i18n 字典（zh.ts/en.ts）中，不直接写在页面 HTML 里，这样更容易管理。

---

## 9. 构建和部署

### 完整流程

```bash
# 第 1 步：本地预览（可选）
npm run dev

# 第 2 步：构建检查（必须）
npm run build

# 看到 "Complete!" 说明成功
# 有红色 error 则需要修复

# 第 3 步：推送部署
git add .
git commit -m "修改了什么内容"
git push
```

> ⚠️ **重要**：每次改完内容，**必须先跑 `npm run build` 确认无报错**，再 `git push`。推送到 main 分支后，Cloudflare Pages 会自动构建上线，约 1-2 分钟生效。

---

## 10. 常见问题

### Q: 改完后网站没变化？
A: 确保跑了 `npm run dev`（本地预览）或 `git push`（线上部署）。浏览器可能需要强制刷新（Cmd+Shift+R）。

### Q: 中英文不同步怎么办？
A: 每个内容都有两个 .md 文件（中文和英文）。改了一边忘记改另一边就会不同步。修改时养成习惯：打开两个文件对照着改。

### Q: 构建报错了怎么办？
A: 常见的错误：
- **漏了引号**：检查 .md 文件的 `---` 之间，每个值都要有引号
- **中英文不配对**：英文版误留了中文内容
- **文件路径不对**：图片路径以 `/images/` 开头

把错误信息截图给 Claude Code，让 AI 帮你修。

### Q: 想新增一个产品怎么办？
A: 联系我（Claude Code），我会：
1. 在 `zh/` 和 `en/` 各新建一个 .md 文件
2. 填入产品信息
3. 如果该品类不在导航中，更新字典文件
4. 验证构建通过

### Q: 想新增一个页面怎么办？
A: 同上，联系我处理。需要告诉我页面名字、放什么内容、需要显示在导航中哪些位置。

### Q: 图片不显示怎么办？
A: 检查：
1. 图片文件确实在 `public/images/` 下
2. .md 文件中 `heroImage` 的路径以 `/images/` 开头
3. 文件名大小写一致（Linux 服务器区分大小写）

---

> 遇到任何问题，直接描述给 Claude Code 即可。比如「帮我把首页的产品描述改成……」「帮我在官网加一个新页面」「帮我更新一下公司地址」——我会直接修改文件并指导你部署。
