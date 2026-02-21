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