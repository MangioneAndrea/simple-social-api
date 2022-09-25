package mongo

import (
	"context"
	"time"

	"github.com/MangioneAndrea/gonsole"
	"github.com/MangioneAndrea/simple-social-api/db/mongo/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Instance = Mongo{
	KnownDBs: map[string]bool{},
}

func Connect(uri string, user string, password string) *Mongo {
	client, err := mongo.NewClient(options.Client().ApplyURI(uri), options.Client().SetAuth(options.Credential{Username: user, Password: password}))
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

func RebuildIndexes(db *mongo.Database) (err error) {
	var indices map[string][]mongo.IndexModel = map[string][]mongo.IndexModel{
		models.UsersModel: models.UsersIndex,
		models.PostsModel: models.PostsIndex,
	}

	for collection, index := range indices {
		_ = db.CreateCollection(context.TODO(), collection)
		_, err = db.Collection(collection).Indexes().DropAll(context.TODO())
		if err != nil {
			return err
		}
		if len(index) == 0 {
			continue
		}
		_, err = db.Collection(collection).Indexes().CreateMany(context.TODO(), index)
		if err != nil {
			return err
		}
	}
	return err
}
