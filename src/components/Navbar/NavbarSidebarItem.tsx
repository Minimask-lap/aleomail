import { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavbarSidebarItemDropdown from '@/components/Navbar/NavbarSidebarItemDropdown';

import { Page } from '../../types'; // Import the shared Page type

interface NavbarSidebarItemProps {
  routes: Page[];
  title: string;
}

const NavbarSidebarItem: FC<NavbarSidebarItemProps> = ({ routes, title }) => {
  const router = useRouter();

  return (
    <div>
      {title && <h4 className="mb-2 uppercase font-Nunito text-sm">{title}</h4>}
      <ul className="flex flex-col gap-2 sidebar">
        {routes.map((page) => (
          <li key={page.linkName}>
            {!page?.subLinks?.length ? (
              <a
                href={page.linkName}
                className={`flex items-center border-b gap-2 ${
                  router.pathname === `/${page.linkName}`
                    ? 'active'
                    : ''
                }`}
            
              >
                {page?.icon && <page.icon />}
                {page.name}
              </a>
            ) : (
              <NavbarSidebarItemDropdown page={page} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarSidebarItem;
