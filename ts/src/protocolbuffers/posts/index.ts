import { PostsServiceClient } from "./posts_grpc_pb";
import { Pagination, Post, Posts } from "./posts_pb";

const client = new PostsServiceClient("0.0.0.0:50051", null, null);

export const getPosts = (page: number, limit: number) =>
  new Promise<Array<Post>>((res, rej) => {
    const pagination = new Pagination();
    pagination.setPage(page);
    pagination.setLimit(limit);
    client.getPosts(pagination, (err, value) => {
      if (err) {
        rej(err);
      } else {
        res(value.getPostsList());
      }
    });
  });

export const createPost = (title: string, content: string) =>
  new Promise<Post>((res, rej) => {
    const post = new Post();
    post.setTitle(title);
    post.setContent(content);
    client.createPost(post, (err, value) => {
      if (err) {
        rej(err);
      } else {
        res(value);
      }
    });
  });
