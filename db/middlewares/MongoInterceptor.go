package middlewares

import (
	"context"

	"github.com/MangioneAndrea/simple-social-api/db/mongo"
	"google.golang.org/grpc"
)

const Dbname = "simple-social-api"

var Mongo Middleware = func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (context.Context, error) {
	// get db reference and store it into the context
	db := mongo.Instance.Client.Database(Dbname)
	c := context.WithValue(ctx, "db", db)

	return c, nil
}
