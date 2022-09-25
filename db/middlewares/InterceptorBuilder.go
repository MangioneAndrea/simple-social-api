package middlewares

import (
	"context"
	"google.golang.org/grpc"
)

type Middleware func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (context.Context, error)

func InterceptorBuilder(middlewares ...Middleware) grpc.ServerOption {
	return grpc.UnaryInterceptor(func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
		for _, middleware := range middlewares {
			ctx, err = middleware(ctx, req, info, handler)
			if err != nil {
				return nil, err

			}
		}
		return handler(ctx, req)
	})
}
