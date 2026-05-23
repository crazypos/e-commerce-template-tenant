# 🧩 Tenant 模板开发指南

本文档说明如何开发 `templates/tenant-store/` 下的模板代码。模板使用 **Next.js App Router + React + Tailwind CSS + Ant Design**，所有核心逻辑（API 请求、认证、购物车等）由平台提供，模板只需关注 UI 呈现。

---

## 目录

- [项目结构](#项目结构)
- [可用 API（Server Actions）](#可用-apiserver-actions)
- [可用 Hooks](#可用-hooks)
- [可用组件](#可用组件)
- [页面开发指南](#页面开发指南)
- [样式与主题](#样式与主题)
- [如何新增页面](#如何新增页面)
- [常见问题](#常见问题)

---

## 项目结构

```
templates/tenant-store/
├── pages/                    ← 页面组件（平台通过 host 动态加载）
│   ├── Layout.tsx            ← 全局布局（Header / Footer）
│   ├── HomePage.tsx          ← 首页
│   ├── CategoryPage.tsx      ← 分类/列表页
│   ├── ProductDetailPage.tsx ← 商品详情页
│   ├── CheckoutPage.tsx      ← 结账页
│   ├── LoginPage.tsx         ← 登录页
│   ├── SignupPage.tsx        ← 注册页
│   ├── ForgotPasswordPage.tsx← 忘记密码
│   ├── ProfilePage.tsx       ← 个人中心
│   ├── ProfileOrdersPage.tsx ← 订单列表
│   ├── OrderDetailPage.tsx   ← 订单详情
│   ├── AddressesPage.tsx     ← 地址管理
│   ├── ContactPage.tsx       ← 联系我们
│   ├── FaqPage.tsx           ← 常见问题
│   ├── PrivacyPolicyPage.tsx ← 隐私政策
│   └── TermsPage.tsx         ← 条款条件
├── components/               ← 模板自有组件
│   ├── index.ts              ← barrel 文件（导出所有组件）
│   ├── NavigationMenu.tsx    ← 导航菜单
│   └── ProductCard.tsx       ← 商品卡片
├── index.ts                  ← 模板入口，导出所有页面
├── metadata.ts               ← SEO metadata
├── theme.ts                  ← Ant Design 主题配置
└── style.css                 ← CSS 变量
```

---

## 可用 API（Server Actions）

所有 API 通过 `'use server'` 的 Server Actions 调用，**无需关心 token 和认证**，平台自动注入。

### 通用

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getMenuAction()` | `Promise<Menu[]>` | 获取导航菜单列表 |

```tsx
import { getMenuAction, type Menu } from '@/src/actions/base';
// Menu: { id, name, pid, url_type, collection_id?, url?, page_id?, children? }
```

### 商品 & 分类

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getCollectionAction(id)` | `ApiCollection` | 获取分类详情 |
| `getCollectionProductsAction(id, opts?)` | `{ data: ProductListItem[], total }` | 获取分类下的商品（分页） |
| `getProductAction(id)` | `ProductDetailView` | 获取商品详情 |
| `getRelatedProductsAction(id)` | `ProductListItem[]` | 获取关联商品 |
| `notifyMeAction(params)` | `{ success }` | 到货通知登记 |

```tsx
import { getCollectionProductsAction, getProductAction, type ProductListItem } from '@/src/actions/product';
// opts: { page?, per_page?, sort?, keyword? }
```

**`ProductListItem` 字段：**

```ts
interface ProductListItem {
  id: number;          // 商品 ID
  variantId: number;   // 默认 variant ID（加入购物车用）
  name: string;        // 商品名称
  price: number;       // 价格
  image: string;       // 首图 URL
  hasVariants: boolean; // 是否有多个 variant
  stock: number;       // 总库存
}
```

**`ProductDetailView` 字段：**

```ts
interface ProductDetailView {
  id: number;
  name: string;
  description?: string;
  image: string;
  images: string[];     // 所有图片
  price?: number;
  attributes: ApiProductAttribute[];  // 属性（颜色/尺寸等）
  variants: Array<{
    id: number; name: string; title: string;
    price: number; stock: number;
    attributes: ApiVariantAttribute[];
  }>;
}
```

### 用户认证

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `loginAction(email, password, rememberMe)` | `User` | 登录，自动设置 cookie |
| `logoutAction()` | `void` | 登出 |
| `getUserAction()` | `User \| null` | 获取当前登录用户 |
| `registerAction(payload)` | `{ success }` | 注册 |
| `sendVerifyCodeAction(email)` | `{ success }` | 发送验证码 |
| `resetPasswordAction(email, password, code)` | `{ success }` | 重置密码 |
| `updateProfileAction(payload)` | `User` | 更新个人信息 |
| `changeBranchAction(branchId)` | `void` | 切换门店 |

```tsx
import { loginAction, getUserAction } from '@/src/actions/auth';
// User: { id, firstName, lastName, name, email, phone, timezone }
```

### 购物车

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getCartListAction(opts?)` | `{ data: ApiCartItem[], total }` | 获取购物车列表 |
| `addToCartAction(variantId, qty)` | `{ success }` | 添加到购物车 |
| `batchAddToCartAction(items)` | `{ success }` | 批量添加 |
| `deleteCartItemAction(cartItemId)` | `{ success }` | 删除购物车项 |
| `batchDeleteCartAction(items)` | `{ success }` | 批量删除 |
| `clearCartAction()` | `{ success }` | 清空购物车 |
| `getCalculateAction(items)` | `{ subtotal, tax, discount }` | 价格计算 |
| `getVariantInventoryAction(variantIds)` | 库存信息 | 获取各分店库存 |

```tsx
import { addToCartAction } from '@/src/actions/cart';
```

### 结账

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `checkoutAction(payload)` | `{ success, data }` | 提交订单 |
| `getPaymentMethods()` | `PaymentMethodApi[]` | 获取可用支付方式 |
| `getBraintreeClientToken()` | `{ token }` | Braintree 支付 token |
| `getNABContext()` | `{ captureContext }` | NAB 支付上下文 |

### 地址

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `listAddressesAction()` | `Address[]` | 地址列表 |
| `saveAddressAction(payload)` | `AddressListItem` | 新增/更新地址 |
| `deleteAddressAction(id)` | `{ success }` | 删除地址 |

### 门店

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getBranchesAction(params?)` | `{ branches: Branch[] }` | 获取门店列表 |

```ts
// Branch: { id, name, latitude?, longitude?, distance?, address? }
```

### 订单

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getOrdersListAction(opts?)` | `{ data: OrderDisplay[], total, current_page, last_page }` | 订单列表 |
| `getOrderDetailAction(orderId)` | `OrderDetailDisplay` | 订单详情 |

```ts
// opts: { page?, per_page?, type?, status?, keyword?, start_date?, end_date? }
```

### 联系我们

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `sendContactAction(data)` | `{ success }` | 提交联系表单 |

### 首页内容（Strapi CMS）

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getHomeContent()` | `{ contents: Content[], products }` | 获取首页装修数据 |

```tsx
import { getHomeContent, type Content } from '@/src/actions/plugins';
// Content types: 'banner' | 'rich-text' | 'collection' | 'section' | 'tabs'
```

---

## 可用 Hooks

所有 hooks 封装了 API 调用 + loading + error 处理，**模板中直接使用**。

| Hook | 返回值 | 说明 |
|------|--------|------|
| `useAuth()` | `{ user, isAuthenticated, login, logout, updateProfile, changeBranch }` | 认证状态 |
| `useCart()` | `{ items, cartTotal, itemCount, addToCart, removeFromCart, clearCart, updateQuantity, isOpen, setIsOpen, loading }` | 购物车 |
| `useProducts()` | `{ loading, getCollection, getCollectionProducts, getProduct, getRelatedProducts, notifyMe }` | 商品查询 |
| `useOrders()` | `{ orders, total, currentPage, lastPage, loading, fetchOrders, fetchOrderDetail }` | 订单管理 |
| `useAddresses()` | `{ addresses, loading, fetchAddresses, saveAddress, removeAddress }` | 地址管理 |
| `useBranches()` | `{ branches, loading, fetchBranches }` | 门店列表 |
| `useCheckout()` | [详见下方](#usecheckout) | 结账流程 |
| `useMenu()` | `{ menus, loading, fetchMenu }` | 导航菜单 |
| `useHomeData()` | `{ contents, products, loading, fetchHomeData }` | 首页数据 |
| `useContact()` | `{ isSubmitting, isSubmitted, submitContact, reset }` | 联系表单 |
| `useLogin()` | `{ email, password, fieldErrors, isLoading, handleSubmit, ... }` | 登录表单 |
| `useSignup()` | `{ firstName, ..., fieldErrors, isLoading, handleSendCode, submitRegistration, ... }` | 注册表单 |
| `useForgotPassword()` | `{ step, email, ..., handleSendCode, handleResetPassword, ... }` | 忘记密码 |
| `usePaymentMethods()` | `{ methods, loading, fetchMethods, fetchBraintreeToken, fetchNABContext }` | 支付方式 |
| `useVariantSelector(productId)` | `{ productDetail, selectedAttributes, matchedVariant, matchedStock, open, close }` | 商品规格选择 |

### useCheckout

复杂 hook，管理完整的结账流程。返回：

```ts
const {
  // 购物车
  items, cartTotal, cartLoading, clearCart,
  // 用户
  user,
  // UI 状态
  isSubmitted, submitting, fieldErrors,
  // 表单
  formData, setFormData,     // { firstName, lastName, email, phone, pickupDate, pickupTime, pickupStore, note, agreedToTerms, ... }
  // 支付
  paymentMethod, setPaymentMethod, paymentMethods, paymentLoading, useStoreCredit, setUseStoreCredit, paymentMethodsRef,
  // 门店
  branches, branchesLoading,
  // 地址
  addresses, addressesLoading, selectedBillingAddressId, guestBillingAddress,
  // 计算
  subtotal, taxAmount, discountAmount, displayTotal, creditAmount, finalTotalDisplay,
  // 库存
  inventoryOverstockRows, inventoryOverstockLoading,
  // 处理器
  handleSubmit, handleInputChange, handleDateChange, confirmInventoryOverstock, loadAddresses,
  // 校验
  inputClass,    // 根据 fieldErrors 生成输入框 CSS class
} = useCheckout();
```

---

## 可用组件

### 模板自有组件（在 `components/` 目录下）

| 组件 | Props | 说明 |
|------|-------|------|
| `NavigationMenu` | `{ variant, menus, pathname, user, onNavigate? }` | 导航菜单（desktop/mobile） |
| `ProductCard` | `{ product: ProductListItem }` | 商品卡片 |

### 平台公共组件（从 `@/src/components/*` 导入）

```tsx
// 模板通过 barrel 文件导出，引用方式：
import { Button, Link, CartDrawerItem, ... } from '../components';
```

| 组件 | 说明 |
|------|------|
| `Link` | 路由 Link（封装 next/link） |
| `Button` | 按钮（type, loading, disabled, onClick, className） |
| `Checkbox` | 复选框 |
| `TextField` | 文本输入框（label, error, ...） |
| `TextArea` | 文本域 |
| `Accordion` | 手风琴折叠面板 |
| `Price` | 价格显示（含会员价、促销价） |
| `CartDrawer` | 侧滑购物车抽屉 |
| `CartDrawerItem` | 购物车项 |
| `AddToCartSection` | 添加到购物车区域（含规格选择） |
| `QuickAddButton` | 快速加购按钮 |
| `RecommendedProducts` | 推荐商品 |
| `InfoCard` | 信息卡片 |
| `UserProfile` | 用户信息组件 |
| `OrderList` | 订单列表组件 |
| `OrderDetail` | 订单详情组件 |
| `AddressList` | 地址列表组件 |
| `PaymentMethods` | 支付方式选择组件 |
| `NotifyMeModal` | 到货通知弹窗 |
| `BillingAddressSection` | 账单地址区域 |
| `ImageUpload` | 图片上传 |
| `HomeOrderNowBtn` | 首页"立即下单"按钮 |
| `MotionDiv`, `MotionH1`, `MotionP` | 动画组件（framer-motion 封装） |
| `FacebookChat` | Facebook Messenger 聊天插件 |
| `AgreementModal` | 协议弹窗 |
| `AgreementCheckbox` | 协议勾选框 |

---

## 页面开发指南

### 页面 Props 约定

每个页面组件接收统一的 `initialData` prop，由平台自动注入：

```tsx
// 首页
export function HomePage({ initialData }: { initialData: HomePageData }) {
  // initialData: { contents: Content[], products: Record<number, ProductListItem> }
}

// 分类页
export function CategoryPage({ initialData }: { initialData: CategoryPageData }) {
  // initialData: { collectionTitle: string, products: ProductListItem[] }
}

// 商品详情页
export function ProductDetailPage({ initialData }: { initialData: ProductPageData }) {
  // initialData: { product: ProductDetailView, relateds: ProductListItem[] }
}

// 订单详情（orderId 从 URL 获取）
export function OrderDetailPage({ orderId }: { orderId: string }) {}

// 其他页面无需 props
export function CheckoutPage() {}
export function LoginPage() {}
// ...
```

### 示例：自定义 HomePage

```tsx
'use client';

import { ProductCard } from '../components';
import type { HomePageData } from '@/src/config/template';

export function HomePage({ initialData }: { initialData: HomePageData }) {
  const { contents, products } = initialData;

  return (
    <div>
      <h1>Welcome to My Store</h1>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(products).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### 示例：使用 Hook 调用 API

```tsx
'use client';

import { useProducts, useCart } from '../components';  // hooks 通过 barrel 导出
import { useState } from 'react';

export function MyCustomSection() {
  const { getCollectionProducts } = useProducts();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const result = await getCollectionProducts(1, { per_page: 10 });
    if (result) setProducts(result.data);
  };

  return (
    <div>
      <button onClick={loadProducts}>Load Products</button>
      {products.map(p => (
        <div key={p.variantId}>
          {p.name} - ${p.price}
          <button onClick={() => addToCart({
            productId: p.id,
            variantId: p.variantId,
            name: p.name,
            price: p.price,
            image: p.image,
          })}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
```

### Context（全局状态）

模板可以直接使用这些 Context：

```tsx
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
// useAuth: { user, isAuthenticated, login, logout, updateProfile, changeBranch }
// useCart: { items, cartTotal, itemCount, addToCart, removeFromCart, ... }
```

---

## 样式与主题

### CSS 变量（`style.css`）

```css
:root {
  --primary: #2563eb;           /* 品牌主色 */
  --primary-dark: #052786;      /* 主色深色 */
  --primary-light: #e2edfc;     /* 主色浅色 */
  --primary-light2: #f8fafc;   /* 背景色 */
  --bg-card: #f5f7fa;          /* 卡片背景 */
  --text-primary: #1e293b;     /* 文本色 */
  --badge-red: #ef4444;
  --badge-orange: #f97316;
}
```

所有颜色通过 CSS 变量定义，通过 `var(--primary)` 引用。**修改品牌色只需改 `style.css`**。

### Ant Design 主题（`theme.ts`）

```ts
import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  hashed: false,
  token: {
    colorPrimary: '#2563eb',
    colorBgLayout: '#f8fafc',
    borderRadius: 8,
  },
};
```

### Tailwind CSS

项目已配置 Tailwind，可直接使用工具类。品牌色通过 CSS 变量引用：

```tsx
<div className="bg-(--primary) text-white">
<div className="text-(--text-primary)">
```

---

## 如何新增页面

1. 在 `pages/` 下创建文件（如 `AboutPage.tsx`）
2. 在 `index.ts` 中添加 export
3. 在平台的 `src/config/template.ts` 的 `TemplatePages` 接口中添加类型
4. 在 `app/` 下添加对应的路由页面，调用 `getTemplatePages()` 获取组件

> ⚠️ 步骤 3-4 需要平台方配合修改核心代码。

---

## 常见问题

### Q: 需要安装 npm 包吗？

不需要。所有依赖（React、Ant Design、Tailwind、dayjs、decimal.js 等）已在 Docker 镜像中预装。模板只写 JSX + CSS。

### Q: 我的改动需要重启吗？

不需要。Docker 开发环境自动热更新（CHOKIDAR_USEPOLLING + WATCHPACK_POLLING），改完文件浏览器即时刷新。

### Q: 可以直接调用后端 API 吗？

不推荐直接调。所有 API 已封装为 Server Actions，自动处理 token 注入和错误处理。直接调用 API 不会有认证信息。

### Q: 如何查看后台返回的数据结构？

在页面中临时 `console.log(initialData)`，在 Docker 容器日志中查看。推荐的做法是看 `src/actions/*.ts` 中的类型定义。

### Q: 可以使用 Ant Design 组件吗？

可以。Ant Design 已预装，直接 `import { Button, Modal, DatePicker } from 'antd'` 即可。

### Q: 模板开发完成后怎么办？

把 `templates/tenant-store/` 整个文件夹发回给平台方，由平台方部署到生产环境。
