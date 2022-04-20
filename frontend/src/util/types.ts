export type UserType = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: RoleType;
  image?: ImageType;
};

export enum RoleType {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export type SignInResponseType = {
  jwt: string;
  user: UserType;
};

export type PostType = {
  id: number;
  user: UserType;
  text?: string;
  image?: ImageType;
  likes: LikeType[];
  comments: CommentType[];
  createdAt: Date;
};

export type FetchPostsType = {
  page: number;
  hasMore: boolean;
  posts: PostType[];
};

export type ImageType = {
  id: number;
  url: string;
};

export type LikeType = {
  id: number;
  user: UserType;
  post: PostType;
};

export type CommentType = {
  id: number;
  text: string;
  user: UserType;
  post: PostType;
  createdAt: Date;
};
