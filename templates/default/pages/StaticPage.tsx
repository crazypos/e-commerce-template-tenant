'use client';

import { AboutPage } from './AboutPage';

/**
 * 通用静态页面路由。
 *
 * slug 由 URL 路径决定：/page/about → slug='about'
 * 在 switch 中添加新的 case 即可新增页面。
 *
 * 每个 case 渲染独立的页面组件，和 HomePage、ContactPage 一样，
 * 可以用 'use client'、Hooks、Ant Design 等，没有内容限制。
 */
export function StaticPage({ slug }: { slug: string }) {
  switch (slug) {
    case 'about':
      return <AboutPage />;
    // case 'shipping':
    //   return <ShippingPage />;
    // case 'returns':
    //   return <ReturnsPage />;
    default:
      return (
        <div className="text-center py-20 text-gray-400">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p>The page &quot;{slug}&quot; does not exist.</p>
        </div>
      );
  }
}
