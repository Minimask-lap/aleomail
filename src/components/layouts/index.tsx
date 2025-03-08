import React, { useEffect, useState } from 'react';
import DashboardHeader from '@/components/Navbar/DashboardHeader';
import DashboardSidebar from '@/components/Navbar/DashboardSidebar';
import { useAccount } from '@puzzlehq/sdk';
import WelcomeScreen from '../ui/WelcomeScreen';
interface DefualtLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: DefualtLayoutProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const { account } = useAccount();
  
useEffect(() => {
  setIsConnected(!!account);
}, [account]);


  return (
    <>
      {isConnected ? (
        <div className="flex bg-[#e3e3e3] p-4 gap-4 max-h-screen h-screen overflow-hidden">
          {' '}
          <DashboardSidebar />
          <div className="flex-grow  shadow-black  border overflow-hidden bg-[#fff]  rounded-[10px]">
            <DashboardHeader />
            <div className=" h-full overflow-hidden">{children}</div>
          </div>
        </div>
      ) : (
        <div className="flex bg-[#12141d] p-4 gap-4 max-h-screen h-screen overflow-hidden">
          <WelcomeScreen />
        </div>
      )}
    </>
  );
};

export default Layout;
