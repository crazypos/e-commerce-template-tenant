# 🧩 Tenant 模板开发指南

本文档说明如何开发模板代码。模板使用 **Next.js App Router + React + Tailwind CSS + Ant Design**，所有核心逻辑（API 请求、认证、购物车等）由平台提供，模板只需关注 UI 呈现。

---

## 目录

- [模板架构](#模板架构)
- [组件使用方式（两种级别）](#组件使用方式两种级别)
- [项目结构](#项目结构)
- [可用 API（Server Actions）](#可用-apiserver-actions)
- [可用 Hooks](#可用-hooks)
- [可用组件](#可用组件)
- [页面开发指南](#页面开发指南)
- [样式与主题](#样式与主题)
- [如何新增页面](#如何新增页面)
- [常见问题](#常见问题)

---

## 模板架构

本仓库包含两层模板：

### `templates/default/`（平台标准模板 — ⚠️ 只读）

平台维护的标准模板，**每次 `git pull` 都可能被更新**。不要直接修改它。

```
templates/
└── default/              ← 平台维护，只读
    ├── pages/            ← 页面组件
    ├── components/       ← 组件（含系统组件的副本）
    ├── index.ts
    ├── metadata.ts
    ├── theme.ts
    ├── style.css
    └── ...
```

### `templates/my-template/`（你的自定义模板 — ✅ 自由修改）

从 `default` 复制后自行修改，**不在版本控制中**，平台更新不影响它。

**创建方式：**

```bash
# 1. 复制标准模板
cp -rf templates/default templates/my-template

# 2. 修改 docker-compose.yml，把 TEMPLATE=default 改为 TEMPLATE=my-template
# 3. 重启
docker compose up
```

之后 `git pull` 只会更新 `default/`，`my-template/` 完全不受影响。

---

## 组件使用方式（两种级别）

你的组件来源有两种：

### 方式一：直接用系统组件

```tsx
// 推荐：通过 barrel 统一导入
import { Button, AddToCartSection, Price } from '@/src/components';

// 也可以直接指定文件路径
import { TextField } from '@/src/components/ui/TextField';
```

- `@/src/components/` 下的系统组件，永远稳定可用
- 平台更新自动同步
- 适合通用 UI 组件（Button、TextField、Checkbox、Price、InfoCard 等）

### 方式二：用自己模板下的组件

```tsx
import { AddToCartSection } from '../components';
```

`../components` 指向**当前激活的模板**下的 components/ 目录：
- `TEMPLATE=default` → `templates/default/components/`
- `TEMPLATE=my-template` → `templates/my-template/components/`

`cp -rf templates/default templates/my-template` 后，my-template 已有全部组件副本，直接在 my-template 里改即可。

---

## 项目结构

```
templates/
└── default/                     ← 平台标准模板（只读，git pull 更新）
    ├── pages/                   ← 页面组件（平台通过 host 动态加载）
    │   ├── Layout.tsx           ← 全局布局（Header / Footer）
    │   ├── HomePage.tsx         ← 首页
    │   ├── CategoryPage.tsx     ← 分类/列表页
    │   ├── ProductDetailPage.tsx ← 商品详情页
    │   ├── CheckoutPage.tsx     ← 结账页
    │   ├── LoginPage.tsx        ← 登录页
    │   ├── SignupPage.tsx       ← 注册页
    │   ├── ForgotPasswordPage.tsx ← 忘记密码
    │   ├── ProfilePage.tsx      ← 个人中心
    │   ├── ProfileOrdersPage.tsx ← 订单列表
    │   ├── OrderDetailPage.tsx  ← 订单详情
    │   ├── AddressesPage.tsx    ← 地址管理
    │   ├── ContactPage.tsx      ← 联系我们
    │   ├── FaqPage.tsx          ← 常见问题
    │   ├── PrivacyPolicyPage.tsx ← 隐私政策
    │   ├── TermsPage.tsx        ← 条款条件
    │   ├── BusinessSignupPage.tsx ← 企业注册
    │   ├── TeamMemberPage.tsx   ← 团队管理
    │   ├── RmaPage.tsx          ← 售后（RMA）列表
    │   ├── RmaCreatePage.tsx    ← 新建售后
    │   └── RmaDetailPage.tsx    ← 售后详情
    ├── components/              ← 组件（模板自有 + 系统组件副本）
    │   ├── index.ts             ← barrel 文件（导出所有组件）
    │   ├── NavigationMenu.tsx   ← 导航菜单
    │   ├── ProductCard.tsx      ← 商品卡片
    │   ├── AddToCartSection.tsx ← 加购区域（可改）
    │   ├── RecommendedProducts.tsx ← 推荐商品（可改）
    │   ├── UserProfile.tsx      ← 用户信息（可改）
    │   ├── OrderList.tsx        ← 订单列表（可改）
    │   ├── OrderDetail.tsx      ← 订单详情（可改）
    │   ├── AddressList.tsx      ← 地址列表（可改）
    │   ├── TermsContent.tsx     ← 条款内容（可改）
    │   ├── AddressSearchInput.tsx ← 地址搜索（可改）
    │   └── checkout/            ← 结账流程组件（可改）
    ├── index.ts                 ← 模板入口，导出所有页面
    ├── metadata.ts              ← SEO metadata
    ├── theme.ts                 ← Ant Design 主题配置
    └── style.css                ← CSS 变量

# 如需自定义，运行：
# cp -rf templates/default templates/my-template
# 然后修改 docker-compose.yml 中 TEMPLATE=my-template
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
| `registerAction(payload)` | `{ success }` | 注册（个人账户） |
| `registerBusinessAction(payload)` | `{ success }` | 注册（企业账户，含 ABN 验证） |
| `sendVerifyCodeAction(email)` | `{ success }` | 发送验证码 |
| `resetPasswordAction(email, password, code)` | `{ success }` | 重置密码 |
| `updateProfileAction(payload)` | `User` | 更新个人信息 |
| `changeBranchAction(branchId)` | `void` | 切换门店 |

```tsx
import { loginAction, getUserAction, registerBusinessAction } from '@/src/actions/auth';
// User: { id, firstName, lastName, name, email, phone, timezone, accountType?, company?, abn? }

// 企业注册示例
await registerBusinessAction({
  email: 'business@example.com',
  code: '123456',
  first_name: 'John',
  last_name: 'Doe',
  telephone: '0412345678',
  password: 'Pass1234',
  confirm_password: 'Pass1234',
  business_name: 'Example Pty Ltd',
  abn: '11 222 333 444',
  address: '123 Main St',
  city: 'Sydney',
  state: 'New South Wales',
  zipcode: '2000',
  country: 'AU',
});
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

### ABN 查询

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `searchABNAction(sn)` | `{ data: ABN }` | 查询/验证 ABN（通过 Strapi） |

```tsx
import { searchABNAction } from '@/src/actions/abn';

const result = await searchABNAction('11222333444');
// result.data: { sn: "11222333444", company: "Example Pty Ltd", active: true }
```

### 企业团队管理

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getTeamMembersAction(opts?)` | `{ data: MemberItem[], total, current_page, last_page }` | 团队成员列表 |
| `addTeamMemberAction(payload)` | `{ success }` | 添加团队成员 |
| `editTeamMemberAction(id, payload)` | `{ success }` | 编辑团队成员 |

```tsx
import { getTeamMembersAction, addTeamMemberAction } from '@/src/actions/teamMembers';

// 列表
const members = await getTeamMembersAction({ page: 1, per_page: 20 });

// 添加成员
await addTeamMemberAction({
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
  password: 'Pass1234',
  confirm_password: 'Pass1234',
  role: 1,
});
```

### 首页内容（Strapi CMS）

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `getHomeContent()` | `{ contents: Content[], products }` | 获取首页装修数据 |

```tsx
import { getHomeContent, type Content } from '@/src/actions/plugins';
// Content types: 'banner' | 'rich-text' | 'collection' | 'section' | 'tabs'
```

### RMA / Warranty

| 函数 | 返回值 | 说明 |
|------|--------|------|
| `createWarrantyAction(payload)` | `{ success }` | 提交 RMA 申请 |
| `getWarrantyListAction(opts?)` | `{ data: WarrantyOrderDisplay[], total, current_page, last_page }` | RMA 订单列表 |
| `getWarrantyDetailAction(id)` | `WarrantyDetailDisplay` | RMA 详情 |
| `searchWarrantyProductAction(name, isPhone, customerId)` | `{ data: WarrantyProductDisplay[] }` | 搜索产品（Autocomplete） |
| `searchWarrantyByImeiAction(imei, customerId)` | `{ data: WarrantyProductDisplay[] }` | 按 IMEI 搜索 |

```tsx
import { createWarrantyAction, getWarrantyListAction, getWarrantyDetailAction } from '@/src/actions/warranty';

// 创建 RMA
await createWarrantyAction({
  reason: 'Product Faulty',
  resolution: 'Store Credit',
  address_id: 123,
  customer_id: 456,
  items: [{ variant_id: 789, quantity: 1 }],
  note: 'Optional note...',
});

// 查询列表
const result = await getWarrantyListAction({ page: 1, per_page: 10 });

// 查询详情
const detail = await getWarrantyDetailAction(42);
// detail.refundItems — 已退款的商品行（含 unit_price, row_total）
// detail.notes — 备注历史
// detail.shipping_address — 收货地址
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
| `useABNSearch()` | `{ searching, searchABN }` | ABN 查询验证（企业注册用） |
| `useTeamMembers()` | `{ list, total, currentPage, lastPage, loading, fetch, addMember, editMember }` | 企业团队成员管理 |
| `useWarrantyList()` | `{ list, total, currentPage, lastPage, loading, fetch }` | RMA 订单列表 |
| `useWarrantyDetail()` | `{ detail, loading, fetch }` | RMA 详情 |
| `useWarrantySearch()` | `{ searching, searchProducts, searchPhones, searchByImei }` | RMA 产品/IMEI 搜索 |
| `useCreateWarranty()` | `{ submitting, submit }` | 创建 RMA 申请 |
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

组件来源有两种，详见前面的[组件使用方式](#组件使用方式两种级别)。

### 模板自有组件副本（在 `components/` 下）

以下组件已从系统复制到模板的 `components/` 目录，有源代码可直接修改：

| 组件 | 说明 |
|------|------|
| `AddToCartSection` | 加购区域（含规格选择、数量、按钮） |
| `RecommendedProducts` | 推荐商品横向滚动 |
| `UserProfile` | 用户个人信息 |
| `OrderList` | 订单列表 |
| `OrderDetail` | 订单详情 |
| `AddressList` | 地址管理列表 |
| `AddressSearchInput` | 地址自动搜索 |
| `TermsContent` | 条款内容 |
| `checkout/*` | 结账流程（BillingSection、ContactInfoSection 等） |
| `NavigationMenu` | 导航菜单 |
| `ProductCard` | 商品卡片 |

### 平台公共组件（从 `@/src/components/*` 导入）

```tsx
import { Button, Link, CartDrawerItem, ... } from '@/src/components/...';
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
| `QuickAddButton` | 快速加购按钮 |
| `InfoCard` | 信息卡片 |
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

### Q: 我应该用 `default` 还是复制成 `my-template`？

直接使用 `default` 最简单，但如果要改组件（比如改按钮样式），一定要先 `cp -rf templates/default templates/my-template`，否则 `git pull` 会覆盖你的改动。

### Q: 只想改一个组件，也要复制整个模板吗？

不用复制整个模板。如果你只想改个别组件：

1. 保持 `TEMPLATE=default` 不变
2. 直接 import 系统组件：`import { Button } from '@/src/components/ui/Button'`
3. 如果需要改特定组件的源代码，再切换到 my-template

或者也可以部分复制：

```bash
# 创建 my-template（只需 pages 目录 + 自己改的文件）
mkdir -p templates/my-template/components
cp templates/default/pages/* templates/my-template/pages/
cp templates/default/components/index.ts templates/my-template/components/
cp templates/default/index.ts templates/my-template/
# 然后复制你要改的那个组件
cp templates/default/components/AddToCartSection.tsx templates/my-template/components/
# 修改 docker-compose.yml TEMPLATE=my-template
```

### Q: `git pull` 会不会把 default 里面的组件覆盖掉？

会的。`default/` 是平台维护的，每次 `git pull` 都可能更新。所以**不要直接改 `default/`**。

先复制到 `my-template`（本地创建，不在 repo 里），再改：

```bash
cp -rf templates/default templates/my-template
# docker-compose.yml 里 TEMPLATE=my-template
# 重启
```

之后 `my-template/` 完全不受 `git pull` 影响。需要同步平台更新时手动对比合并。

### Q: `my-template` 里的组件怎么导入？

```tsx
// 和 default 一样，从 ../components 导入
import { AddToCartSection } from '../components';
```

`../components` 指向当前激活模板（`TEMPLATE` 环境变量指定）下的 `components/` 目录。

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

- 如果基于 `default` 且没改过 → 无需操作，平台自动更新
- 如果用了 `my-template` → 把 `templates/my-template/` 整个发给平台方，由平台方部署到生产环境
