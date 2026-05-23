# e-commerce-template-tenant

CrazyPOS 电商模板的 tenant 开发 starter 包。

## 结构

```
├── templates/
│   └── my-store/         ← 默认模板名称，创建 starter 时改为实际名称
│       ├── pages/        ← 页面组件
│       ├── components/   ← 自定义组件
│       ├── index.ts      ← 页面导出
│       ├── metadata.ts   ← SEO 信息
│       ├── theme.ts      ← Ant Design 主题
│       └── style.css     ← 品牌色变量
```

## 使用

平台方使用 `create-tenant.sh` 脚本基于此仓库生成 tenant starter 包。
