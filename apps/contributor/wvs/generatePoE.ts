import { processData } from '@bucknet/wvs';

export async function generatePoE(epoch: number): Promise<string> {
  const baseDir = __dirname;
  let poe;
  try {
    poe = await processData(baseDir, epoch);
    console.log(`Epoch ${epoch} processed successfully.`);
  } catch (error) {
      console.error('Error processing epochs:', error);
  }

  return poe
}