// ──────────────────────────────────────────────
// default 模板组件 barrel
// 模板自有组件优先，无则 fallback 到 src/components/
// ──────────────────────────────────────────────

// ─── 模板自有组件（覆盖公共组件）───
export { ProductCard } from './ProductCard';

// ─── Fallback 到公共组件 ───

// 导航 / 布局
export { default as Link } from '@/src/components/Link';
export { default as NavigationMenu } from './NavigationMenu';

// 动画
export { MotionDiv, MotionH1, MotionP } from '@/src/components/Motion';

// 首页
export { default as HomeOrderNowBtn } from '@/src/components/HomeOrderNowBtn';

// 商品
export { AddToCartSection } from '@/src/components/AddToCartSection';
export { RecommendedProducts } from '@/src/components/RecommendedProducts';
export { default as Price } from '@/src/components/Price';
export { QuickAddButton } from '@/src/components/QuickAddButton';
export { InfoCard } from '@/src/components/ui/InfoCard';

// 用户
export { UserProfile } from '@/src/components/UserProfile';
export { OrderList } from '@/src/components/OrderList';
export { OrderDetail } from '@/src/components/OrderDetail';
export { AddressList } from '@/src/components/AddressList';

// UI 基础组件
export { Button } from '@/src/components/ui/Button';
export { default as Checkbox } from '@/src/components/ui/Checkbox';
export { AgreementModal } from '@/src/components/AgreementModal';
export { AgreementCheckbox } from '@/src/components/AgreementCheckbox';
export { TextField } from '@/src/components/ui/TextField';
export { TextArea } from '@/src/components/ui/TextArea';
export { Accordion } from '@/src/components/ui/Accordion';
export { ImageUpload } from '@/src/components/ui/ImageUpload';

// 其他
export { CartDrawerItem } from '@/src/components/CartDrawerItem';
export { PaymentMethods } from '@/src/components/PaymentMethods';
export { NotifyMeModal } from '@/src/components/NotifyMeModal';
export { BillingAddressSection } from '@/src/components/BillingAddressSection';
export type { GuestBillingAddress } from '@/src/components/BillingAddressSection';
export type { PaymentMethodsRef } from '@/src/components/PaymentMethods';
