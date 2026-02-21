import type { StoryblokComponentType, ISbStoryData } from '@storyblok/js';

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