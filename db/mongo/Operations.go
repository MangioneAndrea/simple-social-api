package mongo

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Mongo struct {
	Client   *mongo.Client
	KnownDBs map[string]bool
}

func Find[T any](ctx context.Context, from string, props any) ([]*T, error) {
	cursor, err := ctx.Value("db").(*mongo.Database).Collection(from).Find(ctx, props)
	if err != nil {
		return []*T{}, err
	}
	var results []*T
	if err = cursor.All(ctx, &results); err != nil {
		return []*T{}, err
	}

	return results, nil
}

func FindOne[T any](ctx context.Context, from string, props interface{}) (*T, error) {
	cursor := ctx.Value("db").(*mongo.Database).Collection(from).FindOne(ctx, props)
	var result T
	if err := cursor.Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func Drop(ctx context.Context) error {
	err := ctx.Value("db").(*mongo.Database).Drop(ctx)
	return err
}

func InsertOne(ctx context.Context, from string, el any) (primitive.ObjectID, error) {
	result, err := ctx.Value("db").(*mongo.Database).Collection(from).InsertOne(ctx, &el)
	if err != nil {
		return primitive.NilObjectID, err
	}
	return result.InsertedID.(primitive.ObjectID), nil
}

func InsertMany(ctx context.Context, from string, el []any) ([]primitive.ObjectID, error) {
	response, err := ctx.Value("db").(*mongo.Database).Collection(from).InsertMany(ctx, el)
	if err != nil {
		return nil, err
	}
	var result []primitive.ObjectID
	for _, id := range response.InsertedIDs {
		result = append(result, id.(primitive.ObjectID))
	}
	return result, nil
}

func UpdateOne(ctx context.Context, from string, filter any, update any, settings ...*options.UpdateOptions) error {
	_, err := ctx.Value("db").(*mongo.Database).Collection(from).UpdateOne(ctx, filter, bson.M{"$set": update}, settings...)
	if err != nil {
		return err
	}
	return nil
}

func UpdateMany(ctx context.Context, from string, filter any, update any) error {
	_, err := ctx.Value("db").(*mongo.Database).Collection(from).UpdateMany(ctx, filter, bson.M{"$set": update})
	return err
}
func DeleteOne(ctx context.Context, from string, filter any) error {
	r, err := ctx.Value("db").(*mongo.Database).Collection(from).DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	if r.DeletedCount == 0 {
		return errors.New("document not found")
	}
	return nil
}

func DeleteMany(ctx context.Context, from string, filter any) error {
	_, err := ctx.Value("db").(*mongo.Database).Collection(from).DeleteMany(ctx, filter)
	return err
}

func Count(ctx context.Context, from string, filter any) (int64, error) {
	return ctx.Value("db").(*mongo.Database).Collection(from).CountDocuments(ctx, filter)
}