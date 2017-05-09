#!/bin/sh
curl -H "Content-Type: application/json" -X POST -d '{"email":"vito.dinovi@gmail.com", "password": "vwd", "firstname": "vito", "lastname": "dinovi"}' localhost:3000/users/new
