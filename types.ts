// ════════════════════════════════════════════════════════════════
// 📖 Tenant 模板 TypeScript 类型定义
//
// 本文件由平台方自动生成，仅供 IDE / AI 辅助参考。
// ❌ 不要修改此文件，修改会被覆盖且不影响实际运行。
// ✅ 实际类型以 @/src/actions/* 中的定义为准。
// ════════════════════════════════════════════════════════════════

// ────────────────────────────────────────
// 通用工具类型
// ────────────────────────────────────────
// 所有 API Action 返回统一 Result 模式：
//   { success: true; data: T }    — 成功
//   { success: false; message }   — 失败

// ────────────────────────────────────────
// 1. 商品 & 分类 (src/actions/product.ts)
// ────────────────────────────────────────

export interface ApiCollection {
  id: number;
  title: string;
  type?: number;
  description?: string;
  products_count?: number;
  status?: number;
  status_text?: string;
  banner?: Array<{ id: number; url: string }>;
  [key: string]: unknown;
}

export interface ApiProductAttribute {
  id: number;
  name: string;
  values: string[];
}

export interface ApiVariantAttribute {
  id: number;
  name: string;
  value: string;
}

export interface ApiProductVariant {
  id: number;
  product_id: number;
  name: string;
  title: string;
  sku: string | null;
  sold_price: string;        // 最低价
  unit_price: string;        // 含税最低价
  unit_price_ex_tax: string; // 不含税最低价
  retail_price: string;      // 含税零售价
  retail_price_ex_tax: string; // 不含税零售价
  member_price?: { level: string; price: string | number };
  promotion_price: string | null;
  attributes?: ApiVariantAttribute[];
  stock?: number;
  branch_inventory?: BranchInventory[];
  inventory_items?: InventoryItem[];
  [key: string]: unknown;
}

export interface ApiProductPromotion {
  name: string;
  method: string;
  tips: string;
  tag?: string;
  bulkSales?: {
    id: number;
    discount_type: 1 | 2;
    discount_value: number;
    qty: number;
  }[];
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  image?: string | null;
  variants?: ApiProductVariant[];
  promoiton?: ApiProductPromotion;
  promotion?: ApiProductPromotion;
  [key: string]: unknown;
}

export interface ApiProductDetail {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  images?: Array<{ url?: string; id?: number }> | null;
  variants?: ApiProductVariant[];
  promotion_price?: string | null;
  attributes?: ApiProductAttribute[];
  promoiton?: ApiProductPromotion;
  promotion?: ApiProductPromotion;
  stock?: number;
  inventory?: number;
  category?: { id: number; name: string }[];
  [key: string]: unknown;
}

/** 分类列表用（简化视图） */
export interface ProductListItem {
  id: number;
  variantId: number;
  name: string;
  price: number;
  image: string;
  slug?: string;
  hasVariants: boolean;
  stock: number;
}

/** 商品详情页用（简化视图） */
export interface ProductDetailView {
  id: number;
  name: string;
  description?: string;
  image: string;
  images: string[];
  slug?: string;
  price?: number;
  attributes?: ApiProductAttribute[];
  variants?: Array<{
    id: number;
    name: string;
    title: string;
    price: number;
    attributes: ApiVariantAttribute[];
  }>;
}

/** GET /collection/:id → { success, data: ApiCollection } */
export type GetCollectionResult =
  | { success: true; data: ApiCollection }
  | { success: false; message: string };

/** GET /collection/:id/products → { success, data: ProductListItem[], total } */
export type GetCollectionProductsResult =
  | { success: true; data: ProductListItem[]; total: number }
  | { success: false; message: string };

/** GET /products/:id → { success, data: ProductDetailView } */
export type GetProductResult =
  | { success: true; data: ProductDetailView }
  | { success: false; message: string };

/** GET /products/:id/related → { success, data: ProductListItem[] } */
export type GetRelatedProductsResult =
  | { success: true; data: ProductListItem[] }
  | { success: false; message: string };

/** POST /product/notify-arrival → { success } */
export type NotifyMeResult =
  | { success: true }
  | { success: false; message: string };

// ────────────────────────────────────────
// 2. 认证 & 用户 (src/actions/auth.ts)
// ────────────────────────────────────────

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  timezone?: string;
}

/** 注册请求参数 */
export interface RegisterIndividualPayload {
  email: string;
  code: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  telephone: string;
}

/** POST /customer/login → { success, data: User } */
export type LoginResult =
  | { success: true; data: User }
  | { success: false; message: string };

export type RegisterResult =
  | { success: true }
  | { success: false; message: string };

export type SendVerifyCodeResult =
  | { success: true }
  | { success: false; message: string };

export type ResetPasswordResult =
  | { success: true }
  | { success: false; message: string };

export type UpdateProfileResult =
  | { success: true; data: User }
  | { success: false; message: string };

/** GET /customer/info → User | null（未登录返回 null） */
export type GetUserResult = User | null;

// ────────────────────────────────────────
// 3. 购物车 (src/actions/cart.ts)
// ────────────────────────────────────────

export interface ApiCartItemProduct {
  id: number;
  name: string;
  slug?: string;
  [key: string]: unknown;
}

export interface ApiCartItemVariant {
  id: number;
  product_id: number;
  name: string;
  title: string;
  sold_price: string;
  promotion_price?: string | null;
  [key: string]: unknown;
}

export interface ApiCartItem {
  id: number;
  customer_id: number;
  product_id: number;
  variant_id: number;
  name: string;
  unit_price: string;
  quantity: number;
  status: number;
  images?: { url: string }[];
  image?: string;
  created_at: string;
  updated_at: string;
  product?: ApiProduct;
  variant?: ApiProductVariant;
}

export interface BatchAddItem {
  variant_id: number;
  quantity?: number;
}

export type CheckoutCalculate = {
  subtotal: number;
  tax: number;
  discount: number;
};

export type BranchInventory = {
  branch_id: number;
  inventory: number;
  branch_name?: string;
};

export type InventoryItem = {
  branch_id: number;
  qty_available: number;
};

export type VariantInventory = {
  id: number;
  branch_inventory: BranchInventory[];
};

/** GET /customer/shopping-cart */
export type CartListResult =
  | { success: true; data: ApiCartItem[]; total: number }
  | { success: false; message: string };

/** POST /customer/shopping-cart/add */
export type CartAddResult =
  | { success: true; message?: string }
  | { success: false; message: string };

/** DELETE /customer/shopping-cart/:id */
export type CartDeleteResult =
  | { success: true; message?: string }
  | { success: false; message: string };

/** POST /sales/checkout/calculate */
export type CheckoutCalculateResult =
  | { success: true; data: CheckoutCalculate }
  | { success: false; message: string };

/** POST /variants/inventory */
export type VariantInventoryResult =
  | { success: true; data: VariantInventory[] }
  | { success: false; message: string };

// ────────────────────────────────────────
// 4. 结账 (src/actions/checkout.ts)
// ────────────────────────────────────────

export type CheckoutAddress =
  | { id: number }
  | {
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state: string;
      country: string;
      postcode: string;
      save_to_address_book?: boolean;
      type: number;
    };

export type CardPayment = {
  method: 'bpoint';
  card_number: string;
  card_expire_date: string;
  card_cvv: string;
  card_holder_name: string;
};

export type OfflinePayment = {
  method: 'bank_transfer' | 'pay_on_pickup' | 'paypal' | 'store_credit' | 'braintree' | 'nab';
  nonce?: string;
  token?: string;
};

export type CheckoutPayment = CardPayment | OfflinePayment;

/** 结账请求参数 */
export type CheckoutPayload = {
  items: { variant_id: number; quantity: number }[];
  delivery_method: 'pickup';
  pickup_store: number;
  pickup_date: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    contact_number: string;
  };
  address?: CheckoutAddress;
  payment: CheckoutPayment;
  use_store_credit?: boolean;
  comment?: string;
  delivery_id?: number;
};

export type PaymentMethodBankAccount = {
  bank_name: string;
  account_number: string;
  account_name: string;
  bsb_number: string;
  branch_id: number;
  description: string;
};

export type PaymentMethodApi = {
  name: string;
  value: string;
  logo: string;
  accounts?: PaymentMethodBankAccount[];
};

export type BraintreeClientToken = { token: string };
export type NABContext = { captureContext: string };

/** POST /sales/checkout */
export type CheckoutResult =
  | { success: true; data?: { checkout_id?: number; orders?: unknown[] } }
  | { success: false; message: string };

/** GET /payment-methods */
export type GetPaymentMethodsResult =
  | { success: true; data: PaymentMethodApi[] }
  | { success: false; message: string };

export type BraintreeClientTokenResult =
  | { success: true; data: BraintreeClientToken }
  | { success: false; message: string };

export type NABContextResult =
  | { success: true; data: NABContext }
  | { success: false; message: string };

// ────────────────────────────────────────
// 5. 地址 (src/actions/address.ts)
// ────────────────────────────────────────

export type AddressType = 5 | 10; // 5: 账单, 10: 配送

export interface AddressListItem {
  id: number;
  customer_id?: number;
  type: number;
  first_name?: string;
  last_name?: string;
  contact_number?: string;
  country?: string;
  state: string;
  city: string;
  postcode: string;
  address: string;
  address_line_2?: string | null;
  status?: number;
  is_billing_default?: number;
  is_shipping_default?: number;
  type_text?: string;
  created_at?: string;
  updated_at?: string;
}

/** UI 友好地址（由 mapper 转换） */
export interface Address {
  id: number;
  type: AddressType;
  firstName: string;
  lastName: string;
  phone?: string;
  street: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  isBillingDefault?: boolean;
  isShippingDefault?: boolean;
}

export type SaveAddressPayload = {
  id?: number;
  first_name?: string;
  last_name?: string;
  contact_number?: string;
  address: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  type: AddressType;
  is_billing_default?: boolean;
  is_shipping_default?: boolean;
};

/** GET /customer/address */
export type ListAddressesResult =
  | { success: true; data: Address[] }
  | { success: false; message: string };

/** POST /customer/address (or /customer/address/:id for update) */
export type SaveAddressResult =
  | { success: true; data: AddressListItem }
  | { success: false; message: string };

export type DeleteAddressResult =
  | { success: true }
  | { success: false; message: string };

// ────────────────────────────────────────
// 6. 订单 (src/actions/order.ts)
// ────────────────────────────────────────

export interface OrderDisplayItem {
  variant_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  row_total: number;
  image: string;
}

export interface OrderDisplayAddress {
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface OrderDisplay {
  id: number;
  num: string;
  created_at: string;
  type: string;
  status: string;
  total: number;
  paid_amount: number;
  tax: number;
  items: OrderDisplayItem[];
  branch?: { id: number; name: string; address: string };
}

export interface OrderDetailDisplay extends OrderDisplay {
  address?: OrderDisplayAddress;
}

/** GET /customer/orders */
export type OrderListResult =
  | { success: true; data: OrderDisplay[]; total: number; current_page: number; last_page: number }
  | { success: false; message: string };

/** GET /customer/order/:id */
export type OrderDetailResult =
  | { success: true; data: OrderDetailDisplay }
  | { success: false; message: string };

// ────────────────────────────────────────
// 7. 门店 (src/actions/branches.ts)
// ────────────────────────────────────────

export interface Branch {
  id: number;
  name: string;
  latitude?: string;
  longitude?: string;
  distance?: number;
  address?: string;
}

/** GET /branches */
export type GetBranchesResult =
  | { success: true; branches: Branch[] }
  | { success: false; message: string };

// ────────────────────────────────────────
// 8. 通用 (src/actions/base.ts)
// ────────────────────────────────────────

export interface Menu {
  id: number;
  name: string;
  pid: number;
  url_type: 'Link' | 'Collection' | 'Page';
  collection_id?: number;
  url?: string;
  page_id?: string;
  children?: Menu[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/** GET /menus → Menu[] */
export type GetMenuResult = Menu[];

/** POST /contact-us */
export type SendContactResult =
  | { success: true }
  | { success: false; message: string };

// ────────────────────────────────────────
// 9. 首页装修 (src/actions/plugins.ts)
// ────────────────────────────────────────

export interface Page {
  id: number;
  name: string;
  path: string;
  delete_at: string;
  publish_at: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  is_login?: boolean;
}

export interface Banner {
  id: number;
  image: Media;
  link_type: 'internal' | 'external';
  link: string;
  is_login: boolean;
}

export interface Cell {
  id: number;
  type: 'product' | 'link_internal' | 'link_external' | 'collection';
  product_id?: number;
  product_name?: string;
  collection_id?: number;
  collection_name?: string;
  image?: Media;
  link?: string;
  is_login?: boolean;
}

export interface Content {
  id: number;
  name?: string;
  sort: number;
  type: 'banner' | 'rich-text' | 'collection' | 'section' | 'tabs';
  banners?: Banner[];
  rich_text?: string;
  collection_id?: number;
  collection_name?: string;
  layout: 0 | 1 | 2;
  cells?: Cell[];
  is_sub_content?: boolean;
  tab_items?: Content[];
  is_hidden?: boolean;
}

export type Media = {
  id: number;
  createdAt: string;
  updatedAt: string;
  formats: { thumbnail: { name: string; url: string; width: number; height: number } };
} & { name: string; url: string; ext: string; mime: string; size: number; width: number; height: number };

/** GET /pages/path */
export type GetHomeContentResult = {
  contents: Content[];
  products: Record<number, ProductListItem>;
};

// ────────────────────────────────────────
// 10. 保修/RMA (src/actions/warranty.ts)
// ────────────────────────────────────────

export interface WarrantyProductDisplay {
  variant_id: number;
  product_id: number;
  name: string;
  imei?: string;
}

export interface WarrantyOrderDisplayItem {
  id: number;
  name: string;
  sku: string;
  request_qty: number;
  shipped_qty: number;
  quantity: number;
  unit_price: number;
  row_total: number;
  status: string;
  sns: { id: number; name: string; status: string }[];
}

export interface WarrantyNoteDisplay {
  id: number;
  author: string;
  message: string;
  created_at: string;
}

export interface WarrantyOrderDisplay {
  id: number;
  num: string;
  reason: string;
  resolution: string;
  status: string;
  created_at: string;
  items: WarrantyOrderDisplayItem[];
}

export interface WarrantyDetailDisplay extends WarrantyOrderDisplay {
  customer_note: string;
  notes: WarrantyNoteDisplay[];
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    address_line_2: string;
    city: string;
    state: string;
    postcode: string;
  };
  customer: { email: string };
  refundItems: WarrantyOrderDisplayItem[];
}

export type WarrantyListResult =
  | { success: true; data: WarrantyOrderDisplay[]; total: number; current_page: number; last_page: number }
  | { success: false; message: string };

export type WarrantyDetailResult =
  | { success: true; data: WarrantyDetailDisplay }
  | { success: false; message: string };

export type WarrantySearchResult =
  | { success: true; data: WarrantyProductDisplay[] }
  | { success: false; message: string };

export type WarrantyCreateResult =
  | { success: true }
  | { success: false; message: string };
