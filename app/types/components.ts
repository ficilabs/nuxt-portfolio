import type { StoryblokComponentType, SbBlokData, ISbStoryData } from '@storyblok/js';

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
  image: string
}

export interface MyProject extends StoryblokComponentType<'MyProject'> {
  title: string
  description: string
  tags: FilterButton['tag'][]
  demo: {
    url: string
    linktype: 'url'
  }
  code: {
    url: string
    linktype: 'url'
  }
  media: MyImage[]
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
  _uid: string;
  filter: MyProjectFilter[]
  body: MyProject[]
}

export interface MyProfile extends StoryblokComponentType<'MyProfile'> {
  profileImg: MyImage[]
  github: string
  linkedin: string
  instagram: string
}

export interface MyParagraph extends StoryblokComponentType<'MyParagraph'> {
  isReversed?: boolean;
  showScroll?: boolean;
  figure?: MyImage[];
}

export interface MyPage extends StoryblokComponentType<'MyPage'> {
  title?: string
  body?: SbBlokData[]
}

export interface Config extends StoryblokComponentType<'Config'> {
  pages: ISbStoryData[];
}

export interface MyCertificate extends StoryblokComponentType<'MyCertificate'> {
  _uid: string
  title: string
  link?: string
  image?: MyImage[]
}

export interface MyCertificateList extends StoryblokComponentType<'MyCertificateList'> {
  certificates: MyCertificate[]
}