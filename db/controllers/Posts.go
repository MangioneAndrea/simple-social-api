package controllers

import (
	context "context"

	"github.com/MangioneAndrea/simple-social-api/db/protocolbuffers"
)

type Posts struct {
}

// CreatePost implements protocolbuffers.PostsServiceServer
func (*Posts) CreatePost(context.Context, *protocolbuffers.Post) (*protocolbuffers.Post, error) {
	panic("unimplemented")
}

// GetPosts implements protocolbuffers.PostsServiceServer
func (*Posts) GetPosts(context.Context, *protocolbuffers.Pagination) (*protocolbuffers.Posts, error) {
	panic("unimplemented")
}
