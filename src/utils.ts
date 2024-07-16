import DOMPurify from 'isomorphic-dompurify';

export function isValidURLString(str: string) {
  try {
    return Boolean(new URL(str)); 
  } catch (e) {
    return false;
  }
}

export function sanitizeStr(str: string) {
  const clean = DOMPurify.sanitize(str);
  return clean;
}

export async function getHTMLContent(url: string) {
  if (!isValidURLString(url)) {
    console.error(`Invalid URL: ${url}`);
    return;
  }

  let response;
  let html;
  try {
    response = await fetch(url);
    html = await response.text();
  } catch (err) {
    console.log((err as Error).message);
  }

  if (html) {
    const cleanContent = sanitizeStr(html);
    return cleanContent;
  }
}
