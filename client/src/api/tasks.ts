import { apiCall } from './utils'

export async function submitTask(
  wallet: string,
  txId: string,
  message: any,
  messageHash: string
): Promise<any> {
  const { respJson } = await apiCall(
    'POST', `/tasks`,
    {wallet, txId, message, messageHash}
  );
  return respJson;
}
