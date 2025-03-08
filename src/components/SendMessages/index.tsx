import React, { useState } from 'react';
import Layout from '@/components/layouts';
import InboxCard from '@/components/Inbox/InboxCard';
import MessageScreen from '@/components/Inbox/MessageScreen';
import { InboxCardInterface } from '../../types';
import vercel from 'public/vercel.svg';
import SearchIcon from '@/components/ui/Icons/SearchIcon';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useRouter } from 'next/router';
import { Scanner } from '@yudiel/react-qr-scanner';

const SendMessages = () => {
  const [query, setQuery] = useState('');
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const user: InboxCardInterface[] = [
    // {
    //   name: 'Mary ben',
    //   msg: 'old',
    //   image: vercel
    // },
    // {
    //   name: 'Ben Ken',
    //   msg: 'old',
    //   image: vercel
    // },
    // {
    //   name: 'Ken bank',
    //   msg: 'old',
    //   image: vercel
    // }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSearch = () => {
    if (address) {
      setQuery(address);
      // Perform search logic here (e.g., fetch data based on updatedQuery)
      console.log('Searching with query:', address);
    }
  };

  const handleScan = (data:any) => {
    if (data) {
      setAddress(data);
      setIsScanning(false);
      console.log('Scanned Address:', data);

      // Simulate scanning logic
      // Navigate with the address as a query parameter
      router.push({
        pathname: router.pathname, // Keep the current page
        query: { ...router.query, address: data } // Add or update the 'address' query parameter
      });
      console.log('Scanned and searching with query:', data);
    }
  };
 
  const handleError = (error:any) => {
    console.error('QR Scan Error:', error);
    // setIsScanning(false);
  };

  return (
    <>
      <div className="overflow-hidden relative h-full flex flex-col">
        {/* user list */}
        <div className="  h-full bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              {/* <SearchIcon className="absolute top-3 left-3" />{' '} */}
              <input
                value={address}
                onChange={(e) => handleScan(e.target.value)}
                placeholder="Enter Reciever address..."
                className=" !px-10
        rounded-md min-w-[20rem] max-h-[3rem] w-full py-3 text-black placeholder:text-black placeholder:text-xs border-[1px] md:border-[#D4D4D4]  border-gray-500 bg-slate-200 md:bg-white leading-tight focus:outline-none  focus:shadow-outline
      "
              />{' '}
              {/*                 onClick={() => setIsScanning(true)}
               */}
              <button
                onClick={() => setIsScanning(true)}
                className=" absolute text-black  top-3 right-3 rounded-md hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 12 12"
                >
                  <path
                    fill="currentColor"
                    d="M4.25 2A2.25 2.25 0 0 0 2 4.25v.357a.75.75 0 1 0 1.5 0V4.25a.75.75 0 0 1 .75-.75h.357a.75.75 0 1 0 0-1.5zm3.143 0a.75.75 0 1 0 0 1.5h.357a.75.75 0 0 1 .75.75v.357a.75.75 0 1 0 1.5 0V4.25A2.25 2.25 0 0 0 7.75 2zM3.5 7.393a.75.75 0 1 0-1.5 0v.357A2.25 2.25 0 0 0 4.25 10h.357a.75.75 0 1 0 0-1.5H4.25a.75.75 0 0 1-.75-.75zm6.5 0a.75.75 0 1 0-1.5 0v.357a.75.75 0 0 1-.75.75h-.357a.75.75 0 1 0 0 1.5h.357A2.25 2.25 0 0 0 10 7.75zM4.75 5.25a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5z"
                  />
                </svg>{' '}
              </button>
            </div>
          </div>
          <InboxCard routes={user} />
          <MessageScreen />
        </div>
        {isScanning && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className=" p-2 h-fit  rounded-md shadow-md">
              <button
                onClick={() => setIsScanning(false)}
                className="absolute top-10 right-10 text-red-500 font-bold"
              >
                X{' '}
              </button>
              {/* <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                  if (result) handleScan(result.getText());
                  else handleScan('Not Found');
                }}
              /> */}
              <Scanner
                 onScan={(detectedCodes) => {
                  if (detectedCodes.length > 0) {
                    handleScan(detectedCodes[0].rawValue);
                  } else {
                    handleScan('Not Found');
                  }
                }}
              />
              {/* <QrReader
                className="w-[80vh] h-full"
                onResult={(result, error) => {
                  if (result) handleScan(result.getText());
                  if (error) handleError(error);
                }}
                constraints={{ facingMode: 'environment' }}
              /> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SendMessages;
