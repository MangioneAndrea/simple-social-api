package controllers

import (
	context "context"

	"github.com/MangioneAndrea/simple-social-api/db/mongo"
	"github.com/MangioneAndrea/simple-social-api/db/mongo/models"
	"github.com/MangioneAndrea/simple-social-api/db/protocolbuffers"
)

type Posts struct {
}

// CreatePost implements protocolbuffers.PostsServiceServer
func (*Posts) CreatePost(c context.Context, p *protocolbuffers.Post) (*protocolbuffers.Post, error) {
	return mongo.InsertOneAndFind[protocolbuffers.Post](c, models.PostsModel, p)
}

// GetPosts implements protocolbuffers.PostsServiceServer
func (*Posts) GetPosts(c context.Context, p *protocolbuffers.Pagination) (*protocolbuffers.Posts, error) {
	res, err := mongo.Aggregate[protocolbuffers.Post](models.PostsModel).Sort(mongo.SortingMap{"_id": mongo.Descending}).Skip(p.Skip * p.Limit).Limit(p.Limit).Execute(c)

	return &protocolbuffers.Posts{Posts: res}, err
}
