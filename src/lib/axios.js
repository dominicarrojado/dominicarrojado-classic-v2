export function getImageDataFromResponse(res) {
  return `data:${res.headers['content-type']
    .toLowerCase()
    .replace(' ', '')};base64,${Buffer.from(res.data, 'binary').toString(
    'base64'
  )}`;
}
