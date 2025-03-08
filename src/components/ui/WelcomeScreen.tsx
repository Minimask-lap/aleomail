import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNavBarStore } from '../../Store/navbarState';
import { useConnect, useAccount, useDisconnect, Network } from '@puzzlehq/sdk';
import { toast } from 'react-hot-toast';

const WelcomeScreen = () => {
  const router = useRouter();
  const { showNavBar, toggleNavBar } = useNavBarStore();
  // const {
  //   connect,
  //   error: connectError,
  //   loading: connectLoading
  // } = useConnect();
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

  const [isConnected, setIsConnected] = useState(false);

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
        console.log(account);
      } else {
        await disconnect();
        toast.success('Wallet disconnected successfully!');
        console.log(account);
      }
    } catch (error) {
      toast.error(`Operation failed: ${error}`);
    }
  };


  return (
    <div className="flex flex-col text-brand  bg-white/85 w-full h-full justify-center items-center gap-5">
      <div className="text-center flex flex-col gap-2 ">
        <div className="flex flex-row justify-center object-contain text-[30px] text-brand font-bold gap-2 h-auto items-center">
          <img
            src="/aleomail_logo.png"
            className="h-[70px] object-cover"
            alt=""
          />

          {/* zkMail{' '}
                  <i className="text-[8px]">Powered By Aleo |ANS</i> */}
        </div>

        {/* <strong className="font-bold text-3xl mb-6 font-mono">zkMail</strong> */}
        <h1 className="text-4xl font-extrabold font-Nunito">
          Welcome to ALEOMAIL
        </h1>
        <i>Powered By Aleo</i>
        <p>Connect your wallet to start messaging</p>
      </div>
      {account ? (
        <button
          onClick={handleWalletConnect}
          disabled={connectLoading || disconnectLoading}
          className="border !border-[#080808] rounded-[8px] px-4 py-2 font-bold flex items-center gap-3"
        >
          {disconnectLoading ? (
            'Disconnecting...'
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 ">
                {account?.network}
                {account?.shortenedAddress}{' '}
              </div>
              disconnect
            </div>
          )}
        </button>
      ) : (
        <button
          onClick={handleWalletConnect}
          disabled={connectLoading || disconnectLoading}
          className="border !border-[#080808] rounded-[8px] px-4 py-2 font-bold flex items-center gap-3"
        >
          {connectLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
};

export default WelcomeScreen;
