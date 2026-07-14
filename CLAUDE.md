## 关于我
[王梓浩/外贸业务员/非程序员，运营人员，ai爱好者，机械设备出口商，专业自动化设备公司负责人，为客户提供食品行业专业自动化解决方案]。
我用 Claude Code 做[编程]和[制作网站]和[宣传公司产品]和[为国外客户提供了解公司产品渠道]。

## 思维原则
所有决策从问题本质出发，不因「惯例如此」照搬。
回到问题本身：要解决什么？最直接的路径是什么？从零设计会怎么做？
不要谄媚。不要夸我的想法好、不要说「这是个很好的问题」、不要开头加「当然可以」。
给我真实判断，方案有问题直接指出来。发现更好的做法直接说，不用等我问。

## 项目概况
博瑞卡自动化官网，中英双语 Astro 静态站。

**域名**: www.boricatec.com
**框架**: Astro 5 + Tailwind CSS 3
**部署**: Cloudflare Pages（git push 自动上线）

## 内容维护指南

### 修改产品信息
产品内容在 `src/content/products/` 目录下，中英文分两个文件夹：
- 中文: `src/content/products/zh/产品名.md`
- 英文: `src/content/products/en/产品名.md`

改价格、参数、描述直接编辑对应 .md 文件，改完运行 `npm run build` 验证无报错即可。

文件头部 `---` 之间是结构化字段：
- `title`: 产品名称
- `model`: 型号（如 BRK-SC08）
- `category`: 分类（forming/filling/cleaning/automation/cnc）
- `featured`: 是否在首页展示（true/false）
- `order`: 排序（数字越小越靠前）
- `heroImage`: 主图路径（`/images/products/文件名`）
- `specs`: 技术参数表格（label/value 对）
- `features`: 特性列表

`---` 下面是产品描述的 Markdown 正文。

### 修改产品图片
1. 图片放 `public/images/products/` 目录
2. 推荐 WebP 格式
3. 然后在产品 .md 文件的 `heroImage` 字段写 `/images/products/文件名`

### 修改解决方案
解决方案在 `src/content/solutions/` 目录，结构同产品。

### 修改客户案例
案例在 `src/content/caseStudies/` 目录。
- `results`: 成果数据（metric/value 对）
- `challenge` / `solution`: 挑战和方案描述

### 修改导航/按钮文字
导航和按钮文字是中英文分开的字典文件：
- 中文: `src/i18n/zh.ts`
- 英文: `src/i18n/en.ts`

### 修改公司信息
电话、地址、WhatsApp 等通用信息在 `src/lib/constants.ts`，改一次中英文都生效。

### 新增页面
联系我，我会：新建页面 → 添加到导航 → 建中英双语版本。

## 构建和部署
```bash
npm run dev      # 本地预览 http://localhost:4321
npm run build    # 生产构建，验证无报错
npm run preview  # 预览构建结果
```

部署自动触发：`git push` 到 main 分支 → Cloudflare Pages 自动构建上线。

## 自主边界（红线，必须先问我）
以下操作即使在 auto-accept 模式下也必须停下来问我：
- 删除文件、目录或 git 历史
- 修改 .env、密钥、token、CI/CD 配置
- 数据库 schema 变更或数据迁移
- git push、git rebase、git reset --hard、强制推送
- 安装新的全局依赖或修改系统配置
- 公开发布（npm publish、部署到生产、发文章等）

## 通用工程纪律
- 改完主动跑 `npm run build` 验证
- 不要为了让代码跑起来注释掉报错或加绕过标记，找根本原因
- 密钥、token、密码不进代码、不进 commit、不进日志
- 大改动前先在 Plan Mode 出方案，我确认后再动手
