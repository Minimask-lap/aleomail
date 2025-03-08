 import React, { useEffect, useState, useRef } from 'react';
import { toast } from "react-hot-toast";
  import { hashString, hashDate, decrypt, encrypt } from '@/utils/hashUtils';
 
import {
  useConnect,
  useAccount,
  useDisconnect
} from '@puzzlehq/sdk';
 import { EventType } from '@puzzlehq/types';
import { QRCodeSVG } from 'qrcode.react';
 import { useRequestSignature } from '@puzzlehq/sdk';
import { pinata } from '@/utils/config';

import { createHelia } from 'helia';
import { strings } from '@helia/strings';
  //  import { CID } from 'multiformats/cid';
import { dagCbor } from '@helia/dag-cbor';
import { sha512 } from 'multiformats/hashes/sha2';
import { json } from '@helia/json';

    import Link from 'next/link';
import { useRouter } from 'next/router';
import MicIcon from '@/components/ui/Icons/Mic';
  import { useRequestCreateEvent } from '@puzzlehq/sdk';
 
type SpeechRecognition = {
  start: () => void;
  stop: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
};

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
const MessageScreen = () => {
  const router = useRouter();
  const { account } = useAccount();
  const {
    disconnect,
    error: disconnectError,
    loading: disconnectLoading
  } = useDisconnect();

  const { requestSignature, response } = useRequestSignature({ message: 'hi' });
  const [isConnected, setIsConnected] = useState(false);
  const [nickname, setNickname] = useState<string>('');
  const [voiceMessage, setVoiceMessage] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');

  // const [encryptMessage, setEncryptMessage] = useState<CID | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  const addName = async () => {
    const response = await fetch(
      `https://testnet-api.aleonames.id/primary_name/${account?.address}`
    );
    const { name } = await response.json();
    setNickname(name);
  };
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  useEffect(() => {
    if (!window.isSecureContext) {
      toast.error('Speech recognition requires a secure connection (HTTPS).');
      return;
    }

    // Check if SpeechRecognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }
      setVoiceMessage((prev) => prev + transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // console.error('Voice recognition error:', event);
      if (event.error === 'network') {
        toast.error('Network error: Please check your internet connection.');
      } else {
        toast.error(`Voice recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not initialized.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      toast.success('Voice input stopped.');
    } else {
      recognitionRef.current.start();
      toast.success('Voice input started. Speak now!');
    }

    setIsListening(!isListening);
  };
  useEffect(() => {
    setIsConnected(!!account);
    addName();
  }, [account]);
  const now = new Date();

   // Function to convert string to field representation
  function stringToField(str: string) {
    let encoded = BigInt(0);
    for (let i = 0; i < str.length; i++) {
      encoded = (encoded << BigInt(8)) | BigInt(str.charCodeAt(i));
    }
    return encoded.toString(); // Return as a string since Aleo fields are large
  }

  // // Function to convert field back to string
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
  let original =
    ' ';
  let field = stringToField(original);
  let recovered = fieldToString(
    ' '
  );

  // console.log('Original String:', original);
  // console.log('Field Representation:', field);
  // console.log('Recovered String:', recovered);
  
  
   const uploadText = async () => {
    if (!voiceMessage.trim()) {
               toast.error('Please enter some text');  

      return;
    }

    try {
      setUploading(true);

      // Upload plain text as JSON to Pinata
      const uploadData = await pinata.upload.json({ msg: voiceMessage });

      // Generate a signed URL to access the content
      //  const signedUrl = await pinata.gateways.createSignedURL({
      //      cid: uploadData.cid,
      //      expires: 0
      //  });
        toast.success('Please wait for the file to upload');  
      if (uploadData.cid) {
        toast.success('Text uploaded successfully');
            setUrl(uploadData.cid);

      }else{
        toast.error('Text not uploaded successfully');  
      }
    } catch (error:any) {
      console.error(error);
              toast.error(error.message);  

      toast.error('Trouble uploading text');
    } finally {
      setUploading(false);
    }
  };

  // Create an event
  const { createEvent, eventId, loading, error } = useRequestCreateEvent({
    type: EventType.Execute,
    programId: 'aleo_voice321.aleo',
    functionId: 'send_voice',
    fee: 1.28,
    inputs: [
      account?.address ?? '',
      Array.isArray(router.query.address)
        ? router.query.address[0]
        : router.query.address ?? '',
      stringToField(url) + 'field',
      hashDate(now).toString() + 'u128'
    ]
  });

  const handleSubmit = () => {
    if (voiceMessage !== '') {
      uploadText();
      if (uploading !== true || url !== '') {
        createEvent();
      if (eventId !== undefined) {
        toast.success('Message sent');
        setVoiceMessage('');
        setUrl('');

      }else{
        toast.success('Message not sent')
      }
      }else{
        toast.error('Please wait for the file to upload');  
      }
    }
  };

  return (
    <div className="   h-full overflow-hidden bg-[#e3e3e3] w-full  justify-between">
      <div className="bg-white flex flex-col items-center w-full h-[75vh]  gap-2 border-[#3A343414] border pr-2 lg:p-4 p-[4px]">
        <textarea
          value={voiceMessage}
          onChange={(e) => setVoiceMessage(e.target.value)}
          placeholder="Type your message here..."
          className="
        rounded-md lg:min-w-[20rem]  h-full w-full py-3 text-black placeholder:text-black placeholder:text-xs border-[1px] md:border-[#D4D4D4]  border-none bg-brand/10 leading-tight focus:outline-none px-2 focus:shadow-outline
      "
        />
        <div className="flex  my-4 gap-2">
          {' '}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`p-3 rounded-full  ${
              loading ? 'bg-blue-500' : 'bg-[#e3e3e3]'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="lg:w-6 lg:h-6 h-4 w-4"
            >
              <path
                fill="currentColor"
                fill-opacity="0.25"
                d="m16.066 10.184l-3.89-1.795c-2.154-.994-3.231-1.491-3.725-.982c-.493.509.038 1.572 1.101 3.698c.22.44.33.659.33.895s-.11.456-.33.895c-1.063 2.126-1.594 3.19-1.1 3.698c.493.51 1.57.012 3.725-.982l3.889-1.795c1.698-.784 2.548-1.176 2.548-1.816s-.85-1.032-2.549-1.816"
              />
              <path
                fill="currentColor"
                d="M8.895 11.684L8.174 9.52a1 1 0 0 0-.707-.654l-1.78-.445a.8.8 0 0 0-.91 1.134l1.111 2.22a.5.5 0 0 1 0 .448l-1.11 2.22a.8.8 0 0 0 .91 1.134l1.78-.445a1 1 0 0 0 .706-.654l.72-2.163a1 1 0 0 0 0-.632"
              />
            </svg>
          </button>
          {/*             onClick={toggleListening}
           */}
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full  ${
              isListening ? 'bg-blue-500' : 'bg-[#e3e3e3]'
            }`}
          >
            <MicIcon className="lg:w-6 lg:h-6 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageScreen;
