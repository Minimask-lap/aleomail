// utils/hashUtils.ts
import pkg from 'crypto-js';
const { AES, enc } = pkg;

// Retrieve the encryption key securely
// const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPT_KEY;
const encryptionKey: string = 'AleoMailSIH@9574$';

if (!encryptionKey) {
  throw new Error('Encryption key is not defined');
}

/**
 * Encrypt a given string or object
 * @param data - The data to encrypt (string or object)
 * @returns Encrypted string
 */
export const encrypt = (data?: any): string => {
  if (data) {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return AES.encrypt(stringData, encryptionKey).toString();
  }
  return ''; // Return an empty string if no data is provided
};

/**
 * Decrypt an encrypted string
 * @param encryptedData - The encrypted string
 * @returns Decrypted data (string or parsed object)
 */
export const decrypt = (encryptedData: string): any => {
  try {
    if (!encryptedData) {
      throw new Error('Cannot decrypt empty or null data');
    }

    const bytes = AES.decrypt(encryptedData, encryptionKey);
    const decryptedText = bytes.toString(enc.Utf8);

    if (!decryptedText) {
      throw new Error('Failed to decrypt: Invalid data or key');
    }

    try {
      return JSON.parse(decryptedText); // Return parsed JSON if applicable
    } catch {
      return decryptedText; // Return plain string if parsing fails
    }
  } catch (error:any) {
    console.error('Decryption error:', error.message);
    return null;
  }
};

export function hashString(str: string): bigint {
  let hash = BigInt(5381);
  for (let i = 0; i < str.length; i++) {
    hash = BigInt.asUintN(128, (hash * BigInt(33)) ^ BigInt(str.charCodeAt(i)));
  }
  return BigInt.asUintN(128, hash); // Ensure we get a 128-bit unsigned integer
}

export function hashDate(date: Date): bigint {
  const timestamp = BigInt(date.getTime());
  let hash = BigInt(5381);
  let str = timestamp.toString();
  for (let i = 0; i < str.length; i++) {
    hash = BigInt.asUintN(128, (hash * BigInt(33)) ^ BigInt(str.charCodeAt(i)));
  }
  return BigInt.asUintN(128, hash); // Ensure we get a 128-bit unsigned integer
}
 export function reverseHashString(hash: bigint, length: number): string[] {
    let results: string[] = [];
    function recursiveSearch(currentHash: bigint, currentStr: string, index: number) {
        if (index === length) {
            if (currentHash === hash) {
                results.push(currentStr);
            }
            return;
        }

        for (let i = 0; i < 128; i++) { // ASCII range
            let newHash = BigInt.asUintN(128, (currentHash * BigInt(33)) ^ BigInt(i));
            recursiveSearch(newHash, currentStr + String.fromCharCode(i), index + 1);
        }
    }
    recursiveSearch(BigInt(5381), '', 0);
    return results;
}
export function reverseHashDate(hash: bigint): Date[] {
    let results: Date[] = [];
    const start = BigInt(new Date(0).getTime()); // Epoch
    const end = BigInt(new Date().getTime()); // Now
    for (let timestamp = start; timestamp < end; timestamp++) {
        let localHash = BigInt(5381);
        let str = timestamp.toString();
        for (let i = 0; i < str.length; i++) {
            localHash = BigInt.asUintN(128, (localHash * BigInt(33)) ^ BigInt(str.charCodeAt(i)));
        }
        if (localHash === hash) {
            results.push(new Date(Number(timestamp)));
        }
    }
    return results;
}

 

// utils/hashUtils.ts

// function toHex(value: bigint): string {
//     return value.toString(16).padStart(32, '0'); // 128 bits = 32 hex characters
// }

// function hexToBase64(hexString: string): string {
//     const raw = Buffer.from(hexString, 'hex');
//     return raw.toString('base64');
// }

// export function hashString(str: string): string {
//     let hash = BigInt(5381);
//     for (let i = 0; i < str.length; i++) {
//         hash = BigInt.asUintN(128, (hash * BigInt(33)) ^ BigInt(str.charCodeAt(i)));
//     }
//     return hexToBase64(toHex(BigInt.asUintN(128, hash)));
// }

// export function hashDate(date: Date): string {
//     const timestamp = BigInt(date.getTime());
//     let hash = BigInt(5381);
//     let str = timestamp.toString();
//     for (let i = 0; i < str.length; i++) {
//         hash = BigInt.asUintN(128, (hash * BigInt(33)) ^ BigInt(str.charCodeAt(i)));
//     }
//     return hexToBase64(toHex(BigInt.asUintN(128, hash)));
// }