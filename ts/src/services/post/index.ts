import grpc from "@grpc/grpc-js";
import { Message, Method, rpc, RPCImpl, RPCImplCallback } from "protobufjs/minimal";
import {
  Pagination,
  Post,
  PostsServiceClientImpl,
} from "../../protocolbuffers/posts";

const grpcServerUrl = "0.0.0.0:50051";

const Client =  grpc.makeGenericClientConstructor({}, "PostsService", {});
const client = new Client(grpcServerUrl, grpc.credentials.createInsecure());

const rpcImpl: RPCImpl = (
  method: Method, // | rpc.ServiceMethod<Message<{}>, Message<{}>>,
  requestData: Uint8Array,
  callback: RPCImplCallback
) => {
  client.makeUnaryRequest(
    method.service.name + "/" + method.name,
    (message: Message<{}>) => message.toArrayBuffer(),
    (message: Uint8Array) => Post.decode(message),
    requestData,
    (err: Error | undefined, response: Uint8Array) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, response);
      }
    }
  );
};

export const PostService = new PostsServiceClientImpl(rpcImpl);

export const create = (title: string, content: string) => {
  return PostService.CreatePost(Post.fromJSON({ title, content }));
};

export const get = async (skip: number, limit: number) => {
  const { posts } = await PostService.GetPosts(
    Pagination.fromJSON({ skip, limit })
  );
  return posts;
};
