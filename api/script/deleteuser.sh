#!/bin/sh
curl -H "Content-Type: application/json" -b cookie -c cookie -X POST -d '{"email":"vito.dinovi@gmail.com", "password": "vwd"}' localhost:3000/users/delete
