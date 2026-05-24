# e-commerce-template-tenant

CrazyPOS 电商模板的 tenant 开发环境。

本仓库由平台方维护并推送更新，Tenant 通过 `git clone` / `git pull` 获取。

> ⚠️ Tenant 仅有**只读权限**，如需推送请联系平台方。

## 结构

```
├── TEMPLATE_DEV_GUIDE.md       ← 📖 从这里开始！完整的开发文档
├── templates/
│   └── default/                 ← 平台标准模板（只读，git pull 更新）
├── docker-compose.yml           ← 运行配置（变量来自 .env）
├── .env.example                 ← ⚡ 复制为 .env 并填入 token
├── types.ts                     ← API 类型定义（IDE 自动补全用）
└── .gitignore
```

## 快速开始

```bash
# 1. 复制环境配置并填入 token
cp .env.example .env
# 编辑 .env，填入 ADMIN_TOKEN 和 STRAPI_TOKEN

# 2. 复制标准模板到自定义目录
cp -rf templates/default templates/my-template

# 3. 修改 .env：TEMPLATE=default → TEMPLATE=my-template

# 4. 启动
docker compose up
# 浏览器打开 http://localhost:3303
```

> `my-template/` 已加入 `.gitignore`，`git pull` 不会影响你的改动。

## 自定义模板

需要修改页面/组件时，先复制标准模板到本地：

```bash
cp -rf templates/default templates/my-template
# 修改 .env：TEMPLATE=default → TEMPLATE=my-template
# 重启
docker compose up
```

## 获取更新

```bash
git pull          # 只更新 templates/default/
docker compose up # 重启
```

详细开发指南请阅读 **[TEMPLATE_DEV_GUIDE.md](./TEMPLATE_DEV_GUIDE.md)**。
