// 'use client';

// import { useEffect, useState } from 'react';
//  import {
//   RecordStatus,
//   getRecords,
//   GetRecordsResponse,
//   RecordWithPlaintext,
//   useAccount,
//   RecordsFilter,
//   useRecords
// } from '@puzzlehq/sdk';
// import { EventsFilter, useEvents, UseEventsOptions } from '@puzzlehq/sdk';
//   type UseRecordsParams = {
//   address?: string;
//   multisig?: boolean;
//   filter?: RecordsFilter,
//   page?: number,
// }

// export default function AleoMessenger() {
//   const [publicKey, setPublicKey] = useState('');
//   const [messagesSent, setMessagesSent] = useState([]);
//   const [messagesReceived, setMessagesReceived] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isConnected, setIsConnected] = useState(false);
//   const { account } = useAccount();

// const filter: RecordsFilter = {
//   programId: 'credits.aleo';
//   type: 'unspent';
// };
// const { fetchPage, records, error, page, pageCount } = useRecords({filter});
// console.log('Records:', records);
// console.log('Records:', page);
// console.log('Records:', error);
// console.log('Records:', pageCount);

// useEffect(() => {
//   setIsConnected(!!account);
// }, [account]);

//   function cleanU128Private(value: string) {
//     return value.replace(/u128\.private$/, '');
//   }

//   useEffect(() => {
//     if (isConnected) {
//         fetchPage();
//     } else {
//       console.log('No wallet installed!');
//     }
//   }, []);

//   // async function mainConnect() {
//   //   try {
//   //     const utf8Encode = new TextEncoder();
//   //     const bytes = utf8Encode.encode(
//   //       'Welcome to Aleo Simple Messenger, Send message anonymously to another user...'
//   //     );
//   //     await window.leoWallet.signMessage(bytes);
//   //     // await window.leoWallet.connect('ON_CHAIN_HISTORY', 'testnetbeta', [
//   //     //   'credits.aleo',
//   //     //   'aleo_voice101.aleo'
//   //     // ]);

//   //     const res = await RecordWithPlaintext('aleo_voice101.aleo');
//   //     console.log('Fetched Records:', res);

//   //     if (!res || !Array.isArray(res.records)) {
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const sentRecords = res.records
//   //       .filter((record: { recordName: string; }) => record.recordName === 'Voice2')
//   //       .map((record: { data: { sent_to: string; msg: string; date: string; }; }) => ({
//   //         sender: publicKey,
//   //         receiver: cleanU128Private(record.data.sent_to),
//   //         message: cleanU128Private(record.data.msg),
//   //         date: cleanU128Private(record.data.date)
//   //       }));

//   //     const receivedRecords = res.records
//   //       .filter((record: { recordName: string; }) => record.recordName === 'Voice')
//   //       .map((record: { data: { sent_from: any; msg: string; date: string; }; }) => ({
//   //         sender: record.data.sent_from,
//   //         message: cleanU128Private(record.data.msg),
//   //         date: cleanU128Private(record.data.date)
//   //       }));

//   //     setMessagesSent(sentRecords);
//   //     setMessagesReceived(receivedRecords);
//   //     setPublicKey(window.leoWallet.publicKey);
//   //   } catch (error) {
//   //     console.error('Error fetching records:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }

//   return (
//     <div>
//       <h1>Aleo Simple Messenger</h1>
//       {/* <button onClick={copyAddress}>Copy Address</button>
//       <p id="aleoAddress1">
//         {publicKey
//           ? `Wallet: ${publicKey.substr(0, 10)}...${publicKey.substr(-6)}`
//           : 'No Wallet Connected'}
//       </p>

//       {loading ? (
//         <p>Loading messages...</p>
//       ) : (
//         <>
//           <h2>Sent Messages</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Sender</th>
//                 <th>Receiver</th>
//                 <th>Message</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {messagesSent.length > 0 ? (
//                 messagesSent.map((msg, index) => (
//                   <tr key={index}>
//                     <td>
//                       {msg.sender.substr(0, 10)}...{msg.sender.substr(-6)}
//                     </td>
//                     <td>
//                       {msg.receiver.substr(0, 10)}...{msg.receiver.substr(-6)}
//                     </td>
//                     <td>{msg.message}</td>
//                     <td>{msg.date}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4">No messages found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <h2>Received Messages</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th>Sender</th>
//                 <th>Message</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {messagesReceived.length > 0 ? (
//                 messagesReceived.map((msg, index) => (
//                   <tr key={index}>
//                     <td>
//                       {msg.sender.substr(0, 10)}...{msg.sender.substr(-6)}
//                     </td>
//                     <td>{msg.message}</td>
//                     <td>{msg.date}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3">No messages found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </>
//       )} */}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';

import {
  getRecords,
  GetRecordsResponse,
  RecordWithPlaintext,
  useAccount
} from '@puzzlehq/sdk';
import { reverseHashString, reverseHashDate } from '@/utils/hashUtils';
import { useRouter } from 'next/router';
// import { useDecrypt } from '@puzzlehq/sdk';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const RecordsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [records, setRecords] = useState<RecordWithPlaintext[] | undefined>();
  const [totalPageCount, setTotalPageCount] = useState(0);
  const { account } = useAccount();
  const [isConnected, setIsConnected] = useState(false);
// const { decrypt, data } = useDecrypt();

  function cleanU128Private(value: string) {
    return value.replace(/field\.private$/, '');
  }

  const onClick = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const response: GetRecordsResponse = await getRecords({
        filter: {
          programIds: ['aleo_voice321.aleo'],
          status: 'Unspent'
        },
        address: account?.address
      });
      setRecords(response.records);
      setTotalPageCount(response.pageCount);
      console.log('record response:', response);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  const goto = async (data:string) => {
    router.push(data);
  }
  useEffect(() => {
    setIsConnected(!!account);
  }, [account]);

  useEffect(() => {
      onClick();
  }, []);
  function integerToString(intStr: string): string {
    let str = '';
    for (let i = 0; i < intStr.length; i += 3) {
      let ascii = parseInt(intStr.substring(i, i + 3), 10); // Extract 3-digit ASCII code
      str += String.fromCharCode(ascii);
    }
    return str;
  }

  return (
    <div className="relative">
      <div className="flex flex-col overflow-y-auto h-[calc(100vh-80px)]">
        {records && (
          <>
            {records.map((record, index) => (
              <button
                key={index}
                onClick={() => goto(`/view/?id=${record?._id}`)}
                className="p-2 flex justify-start gap-4 border-b items-center bg-slate-100 hover:bg-gray-200"
              >
                <img
                  src="/aleomail_logo.png"
                  alt=""
                  className="aleo-logo border size-10 rounded-full"
                />
                <div className="flex justify-between w-full">
                  <span className="font-semibold">
                    {typeof record?.data?.msg === 'string'
                      ? integerToString(cleanU128Private(record.data.msg))
                      : ''}
                  </span>
                  <span className="font-light text-sm">
                    {' '}
                    <p className="text-xs text-gray-500">
                      {record?.timestamp
                        ? `${formatDistanceToNow(
                            parseISO(record?.timestamp.toISOString())
                          )} ago`
                        : 'N/A'}{' '}
                    </p>
                  </span>
                </div>
              </button>
            ))}
          </>
        )}
        {/* {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map(
          (i) => (
            <button className="p-2 flex justify-start gap-4 border-b items-center bg-slate-100 hover:bg-gray-200">
              <img
                src="/aleomail_logo.png"
                alt=""
                className="aleo-logo border size-10 rounded-full"
              />
              <div className="flex justify-between w-full">
                <span className="font-semibold">Aleomail</span>
                <span className="font-light text-sm">yesterday</span>
              </div>
            </button>
          )
        )} */}
      </div>
      <button
        className="absolute bottom-12 right-4 shadow-4 bg-gray-800 text-white p-8 flex items-center justify-center text-4xl rounded-full size-20"
        onClick={() => goto('/send')}
      >
        +
      </button>
      {records && (
        <div>
          {/* <p>there are {totalPageCount} pages of records</p> */}
          {records.map((record, index) => (
            <p key={index}>
              {/* {typeof record?.data?.date === 'string'
                ? reverseHashDate(
                    BigInt(cleanU128Private(decrypt(record.data.date)))
                  )?.toString() || 'Invalid date'
                : 'Invalid date'} */}
            </p>
          ))}
        </div>
      )}
      {error && <p>error fetching records: {error}</p>}
    </div>
  );
};
