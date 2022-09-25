package models

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const UsersModel = "users"

var UsersIndex = []mongo.IndexModel{{
	// Email is unique
	Keys:    bson.D{{Key: "email", Value: 1}},
	Options: options.Index().SetUnique(true),
}, {
	// Covered query for login
	Keys: bson.D{{Key: "password", Value: 1}, {Key: "email", Value: 1}},
},
}
