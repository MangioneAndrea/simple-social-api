package controllers

import (
	context "context"

	"github.com/MangioneAndrea/simple-social-api/db/protocolbuffers"
)

type Auth struct {
}

// CreateUser implements protocolbuffers.AuthServiceServer
func (*Auth) CreateUser(context.Context, *protocolbuffers.AuthUser) (*protocolbuffers.User, error) {
	panic("unimplemented")
}

// GetAuthUser implements protocolbuffers.AuthServiceServer
func (*Auth) GetAuthUser(context.Context, *protocolbuffers.User) (*protocolbuffers.AuthUser, error) {
	panic("unimplemented")
}
