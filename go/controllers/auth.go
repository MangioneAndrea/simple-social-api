package controllers

import "context"

func (_ *query) Jwt(ctx context.Context, args struct{ Email, Password string }) string {
	return "Hello, world!"
}

func (_ *query) Register(ctx context.Context, args struct{ Email, Password string }) *string {
	res := "Hello, world!"
	return &res
}
