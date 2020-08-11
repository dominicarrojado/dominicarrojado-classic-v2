interface Response {
  headers: {
    [key: string]: string;
  };
  data: string;
  [key: string]: any;
}

export function getImageDataFromResponse(res: Response) {
  return `data:${res.headers['content-type']
    .toLowerCase()
    .replace(' ', '')};base64,${Buffer.from(res.data, 'binary').toString(
    'base64'
  )}`;
}
