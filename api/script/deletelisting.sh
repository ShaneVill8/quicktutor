#!/bin/sh
curl -H "Content-Type: application/json" -b cookie -c cookie -X POST -d '{"id":" "1"}' -b cookie -c cookie localhost:3000/users/delete
