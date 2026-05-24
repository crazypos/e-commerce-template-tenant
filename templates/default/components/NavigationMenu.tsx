'use client';

import React, { useMemo } from 'react';
import { ConfigProvider, Menu } from 'antd';
import type { MenuProps } from 'antd';
import clsx from 'clsx';
import { Link } from '../components';
import type { Menu as MenuType } from '@/src/actions/base';
import type { User } from '@/src/actions/auth';
import { ChevronDown, ChevronRight } from 'lucide-react';

type NavLink = {
  id: string;
  name: string;
  path: string;
  external: boolean;
  children?: NavLink[];
};

function transformMenu(m: MenuType): NavLink {
  let path = '';
  let external = false;

  if (m.url_type === 'Collection') {
    path = `/category/${m.collection_id}`;
  } else if (m.url_type === 'Link') {
    path = m.url || '/';
    external = m.url?.startsWith('http') ?? false;
  }

  return {
    id: m.id.toString(),
    name: m.name,
    path,
    external,
    children: m.children && m.children.length > 0 ? m.children.map(transformMenu) : undefined,
  };
}

export type DefaultNavigationMenuProps = {
  variant: 'desktop' | 'mobile';
  menus: MenuType[];
  pathname: string;
  user: User | null;
  onNavigate?: () => void;
};

export default function DefaultNavigationMenu({
  variant,
  menus,
  pathname,
  user,
  onNavigate,
}: DefaultNavigationMenuProps) {
  const navLinks: NavLink[] = React.useMemo(() => {
    return [
      { id: 'home', name: 'Home', path: '/', external: false },
      ...(menus?.map(transformMenu).filter(m => m !== null) || []),
      { id: 'contact', name: 'Contact Us', path: '/contact', external: false },
      { id: 'about', name: 'About Us', path: '/page/about', external: false },
    ];
  }, [menus]);

  const { activeKey } = React.useMemo(() => {
    const keyToHasChildren = new Map<string, boolean>();
    let activeKey: string | null = null;

    const walk = (nodes: NavLink[]) => {
      for (const node of nodes) {
        const k = node.id.toString();
        keyToHasChildren.set(k, !!node.children?.length);
        if (node.path === pathname && !activeKey) activeKey = k;
        if (node.children?.length) walk(node.children);
      }
    };

    walk(navLinks);
    return { activeKey, keyToHasChildren };
  }, [navLinks, pathname]);

  const items: MenuProps['items'] = useMemo(() => {
    const renderItems = (links: NavLink[], depth: number): MenuProps['items'] => {
      return links.map((link) => {
        const isActive = activeKey === link.id;
        const isFirstLevel = depth === 0;

        const labelClass = clsx(
          isFirstLevel
            ? 'text-sm font-medium transition-colors py-2 flex items-center gap-1'
            : 'text-sm transition-colors group-label',
          isActive
            ? '!text-(--primary) font-semibold'
            : 'text-gray-600 hover:text-(--primary)',
          'select-none'
        );

        const hasChildren = !!link.children?.length;
        const attr = {
          href: link.path,
          target: link.external ? '_blank' : undefined,
          rel: link.external ? 'noopener noreferrer' : undefined,
          className: labelClass,
          onClick: () => {
            if (variant === 'mobile' && !hasChildren) {
              onNavigate?.();
            }
          },
        };

        const arrow = depth > 0 || !hasChildren || variant !== 'desktop' ? null : (
          <ChevronDown size={14} className="translate-y-[1px]" />
        );
        const label = link.external ? (
          <a {...attr}>{link.name}{arrow}</a>
        ) : (
          <Link {...attr}>{link.name}{arrow}</Link>
        );

        // 给 desktop 一级菜单添加底部激活指示器
        let itemStyle: React.CSSProperties | undefined;
        if (isFirstLevel && variant === 'desktop') {
          itemStyle = isActive
            ? { borderBottom: '2px solid var(--primary)', marginBottom: -1 }
            : undefined;
        }

        const menuItem: NonNullable<MenuProps['items']>[number] = {
          key: link.id,
          label,
          style: itemStyle,
          ...(hasChildren ? { children: renderItems(link.children!, depth + 1) } : {}),
        };

        return menuItem;
      });
    };

    return renderItems(navLinks, 0);
  }, [navLinks, activeKey, onNavigate, variant]);

  const selectedKeys = activeKey ? [activeKey] : [];

  const desktopMenu = (
    <ConfigProvider theme={{
      components: {
        Menu: {
          activeBarHeight: 0,
          itemHeight: 40,
          itemPaddingInline: 20,
        }
      }
    }}>
      <Menu
        mode="horizontal"
        items={items}
        selectedKeys={selectedKeys}
        triggerSubMenuAction="hover"
        selectable
        style={{ background: 'transparent', width: '100%', display: 'flex', justifyContent: 'center' }}
        className="!bg-transparent !border-none navigation-menu w-full"
        expandIcon={<ChevronRight size={14} className="translate-y-[2px]" />}
      />
    </ConfigProvider>
  );

  const mobileMenu = (
    <nav className="flex flex-col p-4 gap-2 max-h-[70vh] overflow-y-auto">
      <Menu
        mode="inline"
        items={items}
        selectedKeys={selectedKeys}
        selectable
        style={{ background: 'transparent', border: 'none' }}
        className="!bg-transparent !border-none"
      />

      <div className="h-px bg-gray-100 my-2" />

      <Link
        href={user ? '/profile' : '/login'}
        onClick={() => onNavigate?.()}
        className={clsx(
          'text-sm font-medium text-(--primary)',
          'py-2 hover:opacity-80 transition-opacity'
        )}
      >
        {user ? 'My Profile' : 'Sign In'}
      </Link>
    </nav>
  );

  if (variant === 'desktop') return desktopMenu;
  return mobileMenu;
}
