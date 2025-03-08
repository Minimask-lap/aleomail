import { useEffect, useState } from 'react';
import NavbarSidebarItem from './NavbarSidebarItem';
import { Page } from '../../types';
import Link from 'next/link';
import HomeIcon from '../ui/Icons/HomeIcon';
import Profilecircle from '../ui/Icons/Profilecircle';
import { useNavBarStore } from '../../Store/navbarState';
import HistroyIcon from '../ui/Icons/Histroy';
const Sidebar = () => {
  const { showNavBar, toggleNavBar } = useNavBarStore();

  const services: Page[] = [
    {
      name: 'Inbox',
      linkName: '/',
      icon: HomeIcon,
      subLinks: []
    },
    {
      name: 'Sent',
      linkName: 'sent',
      icon: HistroyIcon,
      subLinks: []
    }
  ];

  useEffect(() => {
    if (showNavBar) {
      toggleNavBar();
    }
  }, []);

  return (
    <>
      <div
        className={`w-[300px] h-full fixed shadow-[#3A343414]  z-40 transition-transform ease-in-out duration-500 lg:translate-x-0 lg:relative shrink-0 bg-white rounded-[10px]  ${
          showNavBar ? 'translate-x-0 ' : '-translate-x-[100%]'
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="p-6 py-2 bg-primary  text-gray-100">
              <Link href={'/'}>
                <div className="flex flex-row justify-center object-contain text-[30px] text-brand font-bold gap-2 h-auto items-center">
                  <img
                    src="/aleomail_logo.png"
                    className="h-[50px] object-cover"
                    alt=""
                  />

                  {/* zkMail{' '}
                  <i className="text-[8px]">Powered By Aleo |ANS</i> */}
                </div>
              </Link>
            </div>
            <div className="flex flex-col px-5 gap-4 mt-4">
              <NavbarSidebarItem title="" routes={services} />
            </div>
          </div>

          <div className=" flex flex-row items-center justify-between p-[30px_16px_30px_16px]">
            <div className="flex flex-row gap-2 items-center">
              <Profilecircle />
              <p className="text-black text-[14px] font-medium leading-[20.3px]">
                Profile{' '}
              </p>
            </div>
            <button className="flex gap-2 text-xs px-3 py-2 rounded-full text-white">
              {/* <IconsLogoutIcon /> */}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay and close button for mobile */}
      {showNavBar && (
        <div className="bg-black/55  z-10 lg:hidden fixed h-screen w-full p-4">
          <div className="flex text-gray-50 justify-end">
            <button
              onClick={toggleNavBar}
              className="z-50 bg-brand rounded-[7px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-10  w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
