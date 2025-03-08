import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  getRecords,
  GetRecordsResponse,
  RecordWithPlaintext,
  useAccount,
 } from '@puzzlehq/sdk';

 import {
   RecordStatus
} from '@puzzlehq/types';

const ViewMessages = () => {
  const [address, setAddress] = useState('');
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');
  const [avater, setAvater] = useState<null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<RecordWithPlaintext | null>(null);
  const [records, setRecords] = useState<RecordWithPlaintext[] | undefined>();
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const { account } = useAccount();

  function cleanU128Private(value: string) {
    return value.replace(/field\.private$/, '');
  }

   // Function to convert field back to string
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

  // Example usage
  let recovered = fieldToString(
    ' '
  );
  console.log('Recovered String:', recovered);

  const findName = async () => {
    const response = await fetch(
      `https://testnet-api.aleonames.id/primary_name/${address}`
    );
    if (response.ok === true) {
      const { name } = await response?.json();
      setNickname(name);
      const category = 'avatar';
      const res = await fetch(
        `https://testnet-api.aleonames.id/resolver?name=${name}&category=${category}`
      );

      const { content } = await res.json();
      setAvater(content);
      const gatewayUrl = content.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const data = await fetch(gatewayUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${data.statusText}`);
      }

      const blob = await data.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    }
  };
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

  useEffect(() => {
    // handleSetAddress();
    findName();
    onClick();
  }, []);
  useEffect(() => {
    if (records && router.query.id) {
      const foundRecord = records.find(
        (record) => record._id === router.query.id
      );
      if (foundRecord) {
        setMessage(foundRecord);
      }
    }
  }, [records, router.query.id]);
 
   return (
    <>
      <div className="overflow-hidden relative h-full flex flex-col">
        {/* user list */}
        <div className="  h-full bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                value={`Sender: ${
                  message && typeof message.data.sent_to === 'string'
                    ? cleanU128Private(message.data.sent_to)
                    : ''
                }`}
                readOnly
                className=" !px-6
        rounded-md min-w-[20rem] max-h-[3rem] w-full py-3 text-black placeholder:text-black placeholder:text-xs border-[1px] md:border-[#D4D4D4]  border-gray-500 bg-slate-200 md:bg-white leading-tight focus:outline-none  focus:shadow-outline
      "
              />{' '}
            </div>
          </div>
          <div className="   h-full overflow-hidden bg-[#e3e3e3] w-full  justify-between">
            <div className="bg-white flex flex-col items-center w-full h-[75vh]  gap-2 border-[#3A343414] border pr-2 lg:p-4 p-[4px]">
              <textarea
                value={
                  message && typeof message.data.msg === 'string'
                    ?  cleanU128Private(message.data.msg)
                    : ''
                }
                readOnly
                className="
        rounded-md lg:min-w-[20rem]  h-full w-full py-3 text-black placeholder:text-black placeholder:text-xs border-[1px] md:border-[#D4D4D4]  border-none bg-brand/10 leading-tight focus:outline-none px-2 focus:shadow-outline
      "
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewMessages;
