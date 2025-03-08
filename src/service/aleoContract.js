// // utils/aleoContract.js
// // import { createTransaction } from 'snarkyjs'; // Adjust if a specific Aleo library exists
// import {
//   Account,
//   initThreadPool,
//   PrivateKey,
//   ProgramManager
// } from '@provablehq/sdk';

// export const setNickname = async (client, nickname) => {
//   try {
//     const tx = await createTransaction(client.walletAddress, {
//       contract: 'aleo_voice123.aleo',
//       function: 'set_nickname',
//       inputs: [nickname]
//     });
//     const response = await client.sendTransaction(tx);
//     return response;
//   } catch (error) {
//     console.error('Error setting nickname:', error);
//     throw error;
//   }
// };

// export const sendVoice = async (client, receiver, msg, date) => {
//   try {
//     const tx = await createTransaction(client.walletAddress, {
//       contract: 'aleo_voice123.aleo',
//       function: 'send_voice',
//       inputs: [client.walletAddress, receiver, msg, date]
//     });
//     const response = await client.sendTransaction(tx);
//     return response;
//   } catch (error) {
//     console.error('Error sending voice note:', error);
//     throw error;
//   }
// };
