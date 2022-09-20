package main

import (
	"fmt"
	"log"
	"net"

	"github.com/MangioneAndrea/simple-social-api/db/controllers"
	"github.com/MangioneAndrea/simple-social-api/db/protocolbuffers"
	"google.golang.org/grpc"
)

const url = ":1274"

func main() {
	s := grpc.NewServer()

	protocolbuffers.RegisterAuthServiceServer(s, &controllers.Auth{})
	protocolbuffers.RegisterPostsServiceServer(s, &controllers.Posts{})

	lis, err := net.Listen("tcp", "0.0.0.0:50051")

	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	fmt.Println("server listening at", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
}
