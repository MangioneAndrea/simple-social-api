package controllers

import (
	context "context"

	"github.com/MangioneAndrea/simple-social-api/db/mongo"
	models "github.com/MangioneAndrea/simple-social-api/db/mongo/models"
	"github.com/MangioneAndrea/simple-social-api/db/protocolbuffers"
	"go.mongodb.org/mongo-driver/bson"
)

type Auth struct {
}

// CreateUser implements protocolbuffers.AuthServiceServer
func (*Auth) CreateUser(c context.Context, u *protocolbuffers.AuthUser) (*protocolbuffers.User, error) {
	id, err := mongo.InsertOne(c, models.UsersModel, bson.M{"email": u.Email, "password": u.Password})

	if err != nil {
		return nil, err
	}

	return &protocolbuffers.User{Id: id.Hex(), Email: u.Email}, nil
}

// GetAuthUser implements protocolbuffers.AuthServiceServer
func (*Auth) GetAuthUser(c context.Context, u *protocolbuffers.User) (*protocolbuffers.AuthUser, error) {
	return mongo.FindOne[protocolbuffers.AuthUser](c, models.UsersModel, bson.M{"email": u.Email})
}
