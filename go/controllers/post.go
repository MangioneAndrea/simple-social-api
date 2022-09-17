package controllers

import "context"

type post struct {
	id      string
	title   string
	content string
}

func (p *post) ID() string {
	return p.id
}

func (p *post) Title() string {
	return p.title
}

func (p *post) Content() string {
	return p.content
}

func (_ *query) Posts(ctx context.Context, args struct{ Page, Amount int32 }) []*post {
	return []*post{}
}

func (_ *query) CreatePost(ctx context.Context, args struct{ Title, Content string }) *post {
	return &post{}
}
