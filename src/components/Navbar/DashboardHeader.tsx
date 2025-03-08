import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SearchIcon from "../ui/Icons/SearchIcon";
import NotificationIcon from "../ui/Icons/NotificationIcon";
import Dropdown from "../ui/Icons/Dropdown";
import { useNavBarStore } from '../../Store/navbarState';
import { useConnect, useAccount, useDisconnect, Network } from '@puzzlehq/sdk';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const Header = () => {
  const router = useRouter();
  const { showNavBar, toggleNavBar } = useNavBarStore();
    const [nickname, setNickname] = useState<string>('');
    const [avater, setAvater] = useState<null>(null);
    const [showQRCode, setQRCode] = useState(false);
  
   const {
     connect,
     data,
     error: connectError,
     loading: connectLoading
   } = useConnect({
     dAppInfo: {
       name: 'AleoMail',
       description: 'AleoMail',
       iconUrl: '/aleomail_logo.png'
     },
     permissions: {
       programIds: {
         [Network.AleoMainnet]: [
           'dapp_1.aleo',
           'dapp_2.aleo',
           'dapp_2_imports.aleo'
         ],
         [Network.AleoTestnet]: [
           'dapp_3.aleo',
           'dapp_3_imports_1.aleo',
           'dapp_3_imports_2.aleo',
           'aleo_voice001.aleo',
           'aleo_voice101.aleo',
           'aleo_voice321.aleo'
         ]
       }
     }
   });
  const { account } = useAccount();
  const {
    disconnect,
    error: disconnectError,
    loading: disconnectLoading
  } = useDisconnect();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

    const [isConnected, setIsConnected] = useState(false);
  const addName = async () => {
    const response = await fetch(
      `https://testnet-api.aleonames.id/primary_name/${account?.address}`
    );
    if (response.ok === true) {

     const { name } = await response.json();
    setNickname(name);
     const category = 'avatar';
    const res = await fetch(
      `https://testnet-api.aleonames.id/resolver?name=${name}&category=${category}`
    );
    
    const { content } = await res.json();
    setAvater(content);
    const gatewayUrl = content.replace(
      'ipfs://',
      'https://ipfs.io/ipfs/'
    );
    const data = await fetch(gatewayUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${data.statusText}`);
    }

    const blob = await data.blob();
    const imageUrl = URL.createObjectURL(blob);
    setImageSrc(imageUrl);
  }
   };

    useEffect(() => {
      setIsConnected(!!account);
    }, [account]);

  useEffect(() => {
    if (connectError) {
      toast.error(`Error connecting: ${connectError}`);
    }
    if (disconnectError) {
      toast.error(`Error disconnecting: ${disconnectError}`);
    }
  }, [connectError, disconnectError]);

  const handleWalletConnect = async () => {
    try {
      if (!isConnected) {
        await connect();
        toast.success('Wallet connected successfully!');
       } else {
        await disconnect();
        toast.success('Wallet disconnected successfully!');
 
      }
    } catch (error) {
      toast.error(`Operation failed: ${error}`);
    }
  };

  const handleToggleNavBar = () => {
    toggleNavBar();
  };
  useEffect(() => {
    setIsConnected(!!account);
    addName();
  }, [account]);


  return (
    <header className="bg-white border-b border-b-[#23232133] font-Nunito">
      <div className="flex justify-between items-center py-2 px-4">
        <div className="lg:hidden flex gap-2">
          <button onClick={handleToggleNavBar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="black"
              className="size-6 w-6  h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className=" "></div>
        <div className="flex items-center gap-5">
          <NotificationIcon />
          {account ? (
            <>
              <button onClick={() => setQRCode(true)} className="">
                <QRCodeSVG
                  value={account?.address || ''}
                  className="w-[30px] h-[30px]"
                />
              </button>
              <button
                onClick={handleWalletConnect}
                disabled={connectLoading || disconnectLoading}
                className="border border-[#1C1C1A] rounded-[8px] px-3 py-2 font-bold flex items-center gap-3"
              >
                {disconnectLoading ? (
                  'Disconnecting...'
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center !text-[12px] gap-2 ">
                      <img
                        src={imageSrc ?? '/aleomail_logo.png'}
                        alt=""
                        className="lg:w-8 lg:h-8 w-4 h-4 object-cover rounded-full"
                      />{' '}
                      {nickname
                        ? nickname
                        : `${account?.network} ${account?.shortenedAddress}`}
                    </div>{' '}
                    {/* <span className="lg:flex hidden">disconnect</span> */}
                  </div>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleWalletConnect}
              disabled={connectLoading || disconnectLoading}
              className="border border-[#1C1C1A] rounded-[8px] px-4 py-2 font-bold flex items-center gap-3"
            >
              {connectLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>{' '}
        {showQRCode && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className=" p-2 h-fit  rounded-md shadow-md">
              <button
                onClick={() => setQRCode(false)}
                className="absolute top-10 bg-white p-2 text-lg rounded-md right-80 text-red-500 font-bold"
              >
                X{' '}
              </button>
              <QRCodeSVG
                value={account?.address || ''}
                className="w-[80vh] h-[80vh]"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
