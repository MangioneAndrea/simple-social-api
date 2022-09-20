package main

import "google.golang.org/grpc"
import "github.com/MangioneAndrea/simple-social-api/db/protocolbuffers"
import "github.com/MangioneAndrea/simple-social-api/db/controllers"

func main() {
	s := grpc.NewServer()

	protocolbuffers.RegisterAuthServiceServer(s, &controllers.Auth{})
}
