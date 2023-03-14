import {
  PublicKey,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js';

// Convert large text into fixed size hash
async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

// Memo compute limits:
// https://spl.solana.com/memo#compute-limits
// Solana compute budget:
// https://docs.solana.com/developing/programming-model/runtime#compute-budget
export const signMemo = async (connection: any, wallet: any, memo: string) => {
  const { publicKey, sendTransaction } = wallet;

  if (!publicKey) {
    return;
  }
  const transaction = new Transaction();

  const memoHash = await digestMessage(memo);

  await transaction.add(
    new TransactionInstruction({
      keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
      data: Buffer.from(memoHash, 'utf8'),
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
    })
  );
  
  try {
    const signature = await sendTransaction(transaction, connection);
    const confirmation = await connection.confirmTransaction(signature, 'finalized');
    return { signature, confirmation, memoHash };
  } catch (error) {
    return { error };
  }
};
