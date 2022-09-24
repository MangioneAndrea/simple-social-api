import grpc from "@grpc/grpc-js";
import {
  Pagination,
  Post,
  PostsServiceClientImpl,
} from "../../protocolbuffers/posts";

const grpcServerUrl = "0.0.0.0:50051";

const Client = grpc.makeGenericClientConstructor({}, "PostsService", {});
const client = new Client(grpcServerUrl, grpc.credentials.createInsecure());

function request(
  service: string,
  method: string,
  data: Uint8Array
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    client.makeUnaryRequest(
      service + "/" + method,
      (message: Uint8Array) => message.buffer as Buffer,
      (message: Uint8Array) => message,
      data,
      (err: Error | null, response: unknown) => {
        if (err) {
          reject(err);
        } else {
          resolve(response as Uint8Array);
        }
      }
    );
  });
}
export const PostService = new PostsServiceClientImpl({ request });

export const create = (title: string, content: string) => {
  return PostService.CreatePost(Post.fromJSON({ title, content }));
};

export const get = async (skip: number, limit: number) => {
  const { posts } = await PostService.GetPosts(
    Pagination.fromJSON({ skip, limit })
  );
  return posts;
};
