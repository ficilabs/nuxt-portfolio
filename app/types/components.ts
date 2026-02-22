import type { StoryblokComponentType } from '@storyblok/js';

export interface MyButton extends StoryblokComponentType<'MyButton'> {
  text: string
  isRound: boolean
  isLink: boolean
  link?: {
    linktype?: string
    cached_url?: string
    url?: string
  };
}

export interface MyButtonList extends StoryblokComponentType<'MyButtonList'> {
  buttons: MyButton[];
}

export interface MyRichText extends StoryblokComponentType<'MyRichText'> {
  text: any
}

export interface MyHero extends StoryblokComponentType<'MyHero'> {
  text: MyRichText[];
  buttonList: MyButtonList[];
}

export interface MyImage extends StoryblokComponentType<'MyImage'> {
  width: number
  height: number
  image: {
    filename: string
    alt: string
  }
  alt: string
}

export interface MyProject extends StoryblokComponentType<'MyProject'> {
  title: string
  description: string
  demo: {
    url: string
    linktype: 'url'
  }
  code: {
    url: string
    linktype: 'url'
  }
  media: MyImage
}

export interface FilterButton extends MyButton {
  isRound: true;
  tag: 'vue' | 'angular' | 'nuxt' | 'vanilla' | 'show-all';
}

export interface MyProjectFilter {
  _uid: string;
  buttonList: FilterButton[];
}

export interface MyProjectList extends StoryblokComponentType<'MyProjectList'> {
  body: MyProject[]
}