interface Response {
  headers: {
    'content-type': string;
  };
  data: BinaryType;
}

export function getImageDataFromResponse(res: Response) {
  return `data:${res.headers['content-type']
    .toLowerCase()
    .replace(' ', '')};base64,${Buffer.from(res.data, 'binary').toString(
    'base64'
  )}`;
}
