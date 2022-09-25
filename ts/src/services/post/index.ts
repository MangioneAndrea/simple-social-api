import grpc from "@grpc/grpc-js";
import {
  Pagination,
  Post,
  PostsServiceClientImpl,
} from "../../protocolbuffers/posts";
import { request } from "../../protocolbuffers";

export const PostService = new PostsServiceClientImpl({ request });

export const create = (title: string, content: string) => {
  return PostService.CreatePost(Post.fromJSON({ title, content }));
};

export const get = async (page: number, limit: number) => {
  try {
    const { posts } = await PostService.GetPosts(
      Pagination.fromJSON({ skip: page - 1, limit })
    );
    return posts;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
