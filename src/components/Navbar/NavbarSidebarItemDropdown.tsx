import { FC, useState } from 'react';
import { Page } from '../../types'; // Import the shared Page type
import { useRouter } from 'next/router';

interface NavbarSidebarItemDropdownProps {
  page: Page;
}

const NavbarSidebarItemDropdown: FC<NavbarSidebarItemDropdownProps> = ({
  page
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <>
      <button
        className={`flex justify-between sidebar-btn ${
          router.pathname.startsWith(`/${page.linkName}`) ? 'active' : ''
        }`}
        onClick={toggleDropdown}
      >
        <span className="flex items-center gap-2">
          {page?.icon && <page.icon />}
          {page.name}
        </span>
        {/* <IconsArrowDown className={showDropdown ? 'rotate-180' : ''} /> */}
      </button>

      {showDropdown && (
        <ul className="flex flex-col  overflow-hidden mt-1 sidebar">
          {page.subLinks?.map((link) => (
            <li key={link.linkName}>
              <a
                href={link.linkName}
                className={router.pathname === link.linkName ? 'active' : ''}
              >
                {link?.icon && <link.icon />}
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default NavbarSidebarItemDropdown;
