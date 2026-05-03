import xss from 'xss';
import validator from 'validator';

export function cleanAndValidate(input: string | undefined): string | null {
  if (!input) return null;
  const sanitized = xss(input);

  const isValid = validator.isURL(sanitized, {
    require_protocol: false, // for domain-like values like `google.com`
  });

  return isValid ? sanitized : null;
}

export async function blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // returns data URL
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
