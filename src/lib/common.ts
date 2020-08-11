export function getPublicURL(url: string) {
  return `${process.env.PUBLIC_URL}${url}`;
}
