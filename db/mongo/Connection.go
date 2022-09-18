package mongo

import (
	"context"
	"github.com/MangioneAndrea/gonsole"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

var Instance = Mongo{
	KnownDBs: map[string]bool{},
}

func Connect(uri string) *Mongo {
	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		gonsole.Error(err, "Creating mongo client", gonsole.ShowIfNotNil)
		panic(err)
		return nil
	}
	Instance.Client = client

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = Instance.Client.Connect(ctx)
	if err != nil {
		gonsole.Error(err, "Connecting to mongo client", gonsole.ShowIfNotNil)
		return nil
	}
	databases, err := client.ListDatabaseNames(ctx, bson.M{})
	if err != nil {
		gonsole.Error(err, "Fetching databases", gonsole.ShowIfNotNil)
		return nil
	}
	for _, database := range databases {
		if database != "admin" && database != "local" {
			Instance.KnownDBs[database] = true
		}
	}

	return &Instance
}
