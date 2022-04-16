export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
  image?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export type SignInResponse = {
  jwt: string;
  user: User;
};

export type Post = {
  id: number;
  user: User;
  text: string;
  image?: Image;
  likes: Like[];
  comments: Comment[];
};

export type Image = {
  id: number;
  url: string;
  post?: Post;
  user?: User;
};

export type Like = {
  id: number;
  user: User;
  post: Post;
};

export type Comment = {
  id: number;
  text: string;
  user: User;
  post: Post;
  createdAt: Date;
};
