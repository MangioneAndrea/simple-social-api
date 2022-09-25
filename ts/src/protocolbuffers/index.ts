import grpc from "@grpc/grpc-js";

const client = new grpc.Client(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

export const request = (service: string, method: string, data: Uint8Array) => {
  // Conventionally in gRPC, the request path looks like
  //   "package.names.ServiceName/MethodName",
  // we therefore construct such a string
  const path = `/${service}/${method}`;

  return new Promise<Uint8Array>((resolve, reject) => {
    // makeUnaryRequest transmits the result (and error) with a callback
    // transform this into a promise!
    const resultCallback = (err: Error | null, res: Uint8Array) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    };

    function passThrough(argument: any) {
      return argument;
    }

    // Using passThrough as the serialize and deserialize functions
    client.makeUnaryRequest(
      path,
      passThrough,
      passThrough,
      data,
      resultCallback
    );
  });
};
