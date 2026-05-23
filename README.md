# e-commerce-template-tenant

CrazyPOS 电商模板的 tenant 开发环境。

本仓库由平台方维护并推送更新，Tenant 通过 `git clone` / `git pull` 获取。

> ⚠️ Tenant 仅有**只读权限**，如需推送请联系平台方。

## 结构

```
├── TEMPLATE_DEV_GUIDE.md       ← 📖 从这里开始！完整的开发文档
├── templates/
│   ├── default/                 ← 平台标准模板（只读，git pull 更新）
│   │   ├── pages/
│   │   ├── components/
│   │   ├── index.ts
│   │   ├── metadata.ts
│   │   ├── theme.ts
│   │   └── style.css
│   └── my-template/            ← ⚡ 创建模板（本地创建，不在版本控制中）
├── docker-compose.yml           ← 运行配置（token 需自行填写）
├── types.ts                     ← API 类型定义（IDE 自动补全用）
└── .gitignore
```

## 快速开始

```bash
# 直接用标准模板启动（无需自定义）
docker compose up
# 浏览器打开 http://localhost:3303
```

## 自定义模板

需要修改页面/组件时，先复制标准模板到本地：

```bash
cp -rf templates/default templates/my-template
# 然后修改 docker-compose.yml：TEMPLATE=default → TEMPLATE=my-template
# 重启
docker compose up
```

`my-template/` 已加入 `.gitignore`，`git pull` 不会影响你的改动。

## 获取更新

```bash
git pull          # 只更新 templates/default/
docker compose up # 重启
```

详细开发指南请阅读 **[TEMPLATE_DEV_GUIDE.md](./TEMPLATE_DEV_GUIDE.md)**。
