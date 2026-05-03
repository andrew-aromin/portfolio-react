import axios from 'axios';
import { cleanAndValidate } from '../src/helpers.js';

export async function downloadLogo(domain: string | any): Promise<Buffer> {

  const cleanedDomain = cleanAndValidate(domain as string);

  if(!cleanedDomain) {
    throw new Error("Error: invalid domain");
  }

  const clearbitUrl = `https://logo.clearbit.com/${domain}`;

  try {
    const response = await axios.get(clearbitUrl, {
      responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
