package controllers

import (
	"fmt"
	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"log"
	"net/http"
	"os"
)

type query struct{}

func RunGraphql() {
	b, err := os.ReadFile("../graphql/schema.graphql")
	if err != nil {
		fmt.Println(err)
	}
	s := string(b)
	schema := graphql.MustParseSchema(s, &query{})
	http.Handle("/graphql", &relay.Handler{Schema: schema})
	log.Fatal(http.ListenAndServe(":8080", nil))
}
