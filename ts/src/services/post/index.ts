import { createPost, getPosts } from "../../protocolbuffers/posts";
import * as Util from "../../util";

export const create = (title: string, content: string) => {
  return createPost(title, content);
};

export const get = (skip: number, limit: number) => {
  return getPosts(skip, limit);
};
