export type Work = {
  title: string;
  desc: string;
  urls: Array<{
    title: string;
    url: string;
  }>;
  img: string;
  gif: string;
  starred?: boolean;
};

export type Social = {
  name: string;
  title: string;
  url: string;
};

export type Quote = {
  quote: string;
  author: string;
};
