# e-commerce-template-tenant

CrazyPOS 电商模板的 tenant 开发环境。

本仓库由平台方维护并推送更新，Tenant 通过 `git clone` / `git pull` 获取。

> ⚠️ Tenant 仅有**只读权限**，如需推送请联系平台方。

## 结构

```
├── TEMPLATE_DEV_GUIDE.md       ← 📖 从这里开始！完整的开发文档
├── templates/
│   └── my-template/           ← 模板代码（改这里！）
│       ├── pages/              ← 页面组件
│       ├── components/         ← 自定义组件
│       ├── index.ts            ← 页面导出
│       ├── metadata.ts         ← SEO 信息
│       ├── theme.ts            ← Ant Design 主题
│       └── style.css           ← 品牌色变量
├── docker-compose.yml          ← 运行配置（token 已注入）
├── types.ts                    ← API 类型定义（IDE 自动补全用，不需修改）
└── .gitignore
```

## 快速开始

```bash
docker compose up
# 浏览器打开 http://localhost:3303
```

## 获取更新

```bash
git pull
docker compose up
```

详细开发指南请阅读 **[TEMPLATE_DEV_GUIDE.md](./TEMPLATE_DEV_GUIDE.md)**。
