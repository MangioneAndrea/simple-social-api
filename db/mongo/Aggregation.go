package mongo

import (
	"context"
	"encoding/json"
	"github.com/MangioneAndrea/gonsole"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type aggregation[T any] struct {
	stages []bson.D
	from   string
}

func Aggregate[T any](from string) *aggregation[T] {
	return &aggregation[T]{
		stages: []bson.D{},
		from:   from,
	}
}

func (a *aggregation[T]) Execute(ctx context.Context) ([]*T, error) {
	cursor, err := ctx.Value("db").(*mongo.Database).Collection(a.from).Aggregate(ctx, mongo.Pipeline(a.stages))
	if err != nil {
		return nil, err
	}
	var results []*T
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}
func (a *aggregation[T]) Match(d bson.M) *aggregation[T] {
	a.stages = append(a.stages, bson.D{{"$match", d}})
	return a
}

func (a *aggregation[T]) Lookup(from string, as string, localField string, foreignField string) *aggregation[T] {
	a.stages = append(a.stages, bson.D{
		{"$lookup",
			bson.D{
				{"from", from},
				{"localField", localField},
				{"foreignField", foreignField},
				{"as", as},
			},
		},
	})
	return a
}
func (a *aggregation[T]) Join(separator string, fields ...string) *aggregation[T] {
	var arr []string

	for i, elem := range fields {
		arr = append(arr, elem)
		if i < len(fields)-1 {
			arr = append(arr, separator)
		}
	}
	a.Concat(arr...)
	return a
}

func (a *aggregation[T]) Concat(fields ...string) *aggregation[T] {
	a.stages = append(a.stages, bson.D{{"$concat", fields}})
	return a
}

func (a *aggregation[T]) Skip(amount int) *aggregation[T] {
	a.stages = append(a.stages, bson.D{{"$skip", amount}})
	return a
}

func (a *aggregation[T]) Limit(amount int) *aggregation[T] {
	a.stages = append(a.stages, bson.D{{"$limit", amount}})
	return a
}

func (a *aggregation[T]) Unwind(path string, preserveNullAndEmptyArrays bool) *aggregation[T] {
	a.stages = append(a.stages, bson.D{{"$unwind",
		bson.D{{"path", "$" + path}, {"preserveNullAndEmptyArrays", preserveNullAndEmptyArrays}}}},
	)
	return a
}

func (a *aggregation[T]) AddFields(fields map[string]any) *aggregation[T] {
	a.stages = append(a.stages, bson.D{
		{
			"addFields", fields,
		},
	})
	return a
}

func (a *aggregation[T]) Print() *aggregation[T] {
	toPrint := make([]bson.M, len(a.stages))

	for i, stage := range a.stages {
		toPrint[i] = stage.Map()
	}
	indent, err := json.MarshalIndent(toPrint, "", "    ")
	if err != nil {
		gonsole.Error(err, "aggregation print")
	} else {
		gonsole.Success(string(indent), "aggregation print", gonsole.ShowIfNotNil)
	}
	return a
}

func (a *aggregation[T]) Project(fields ...any) *aggregation[T] {
	projection := make(map[string]interface{})
	for _, el := range fields {
		switch el.(type) {
		case string:
			projection[el.(string)] = true
		case bson.D:
			for _, e := range el.(bson.D) {
				projection[e.Key] = e.Value
			}
		case bson.M:
			for key, value := range el.(bson.M) {
				projection[key] = value
			}
		}
	}
	a.stages = append(a.stages, bson.D{
		{
			"$project", projection,
		},
	})
	return a
}

func ToDate(field any) bson.D {
	return bson.D{{
		"$toDate", field,
	}}
}
func ToLong(field any) bson.D {
	return bson.D{{
		"$toLong", field,
	}}
}
