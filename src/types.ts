export enum SocialNames {
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  EMAIL = 'email',
}

export enum GoogleAnalyticsEvents {
  SCROLL_CLICK = 'scroll_click',
  SOCIAL_HOVER = 'social_hover',
  SOCIAL_CLICK = 'social_click',
  PROJECT_HOVER = 'project_hover',
  PROJECT_CLICK = 'project_click',
  PROJECT_INFO_HOVER = 'project_info_hover',
  GIF_AUTO_PLAY_START = 'gif_auto_play_start',
  GIF_AUTO_PLAY_CANCEL = 'gif_auto_play_cancel',
}

export type Nullish<T> = T | null | undefined;

export type WorkUrl = {
  title: string;
  url: string;
};

export type Work = {
  title: string;
  desc: string;
  urls: Array<WorkUrl>;
  img: string;
  gif: string;
  starred?: boolean;
};

export type Social = {
  name: SocialNames;
  title: string;
  url: string;
};

export type Quote = {
  quote: string;
  author: string;
};
