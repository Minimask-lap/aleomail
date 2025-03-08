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
 import { RecordStatus } from '@puzzlehq/types';

export const SentMessagesList = () => {
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
  function cleanPrivate(value: string) {
    return value.replace(/.private$/, '');
  }

  const onClick = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const response: GetRecordsResponse = await getRecords({
        filter: {
          programIds: ['aleo_voice321.aleo'],
          status: RecordStatus.Unspent
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
  const goto = async (data: string) => {
    router.push(data);
  };
  useEffect(() => {
    setIsConnected(!!account);
  }, [account]);

  useEffect(() => {
    onClick();
  }, []);
  function fieldToString(encodedStr: string): string {
    let encoded = BigInt(encodedStr);
    let str = '';

    while (encoded > BigInt(0)) {
      let charCode = Number(encoded & BigInt(255)); // Extract last 8 bits
      str = String.fromCharCode(charCode) + str; // Prepend character
      encoded = encoded >> BigInt(8); // Shift right by 8 bits
    }

    return str;
  }
  console.log('field to string', fieldToString(' '));
  return (
    <div className="relative">
      <div className="flex flex-col overflow-y-auto pb-20 h-[calc(100vh-80px)]">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading messages...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-red-500">Error fetching records: {error}</p>
          </div>
        ) : records && records.length > 0 ? (
          records
            .filter((data) => data.name === 'Voice2')
            .map((record, index) => (
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
                  <div className="flex flex-col justify-start text-left">
                    <span className="font-normal">
                      {typeof record?.data?.sent_to === 'string'
                        ? cleanPrivate(record?.data?.sent_to)
                        : ''}
                    </span>
                    <span className="font-light text-sm">
                      {typeof record?.data?.msg === 'string'
                        ? cleanU128Private(record?.data?.msg)
                        : ''}
                    </span>
                  </div>
                  <span className="font-light text-sm">
                    <p className="text-xs text-gray-500">
                      {record?.timestamp
                        ? `${formatDistanceToNow(
                            parseISO(record?.timestamp.toISOString())
                          )} ago`
                        : 'N/A'}
                    </p>
                  </span>
                </div>
              </button>
            ))
        ) : (
          // Show empty state only when no messages exist
          <div className="flex justify-center items-center py-10 flex-col">
            <img
              src="/asset/emptyState.png"
              className="w-[30%]"
              alt="No messages"
            />
            <p className="text-gray-500 mt-2">No messages yet</p>
          </div>
        )}
      </div>

      <button
        className="absolute bottom-20 right-4 shadow-4 hover:bg-slate-500 bg-gray-800 text-white px-4 py-2 flex items-center justify-center text-2xl rounded-full"
        onClick={() => goto('/send')}
      >
        Send mail
      </button>
    </div>
  );
};
