# Simple social API

This project aims to show how to create a full application as a simple social network. Goal is simplicity but correctness. Just some "simple" features which require some engineering.

The project should make you familiar with:
- NodeJS / Typescript / express.js
- Go
- Grpc
- GraphQL
- MongoDB

The goals are:
- Learn the stack!
- Do not overengineer
- Keep it simple. (Ideal no commentary at all!)

## The project

The idea of the project is simple. There is only an API and no graphical interface. In the end the user will be able to login, create posts, like posts, follow other users, get a list of posts with filters (only followed, most liked, most liked recently...)

The whole thing is implemented with the microservices pattern. E.g. Changing the db from mongo to something else should not require any edit, apart of the DB microservice