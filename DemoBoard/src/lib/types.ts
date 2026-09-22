export type Category = '기술' | '일상' | '뉴스' | '질문' | '공지';

export const CATEGORIES: Category[] = ['기술', '일상', '뉴스', '질문', '공지'];

export const LIMITS = {
  TITLE_MAX: 200,
  CONTENT_MAX: 10000,
  TAG_MAX: 10,
};

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  category: Category;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
}
