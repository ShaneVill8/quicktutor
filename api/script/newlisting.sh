#!/bin/sh
curl -H "Content-Type: application/json" -b cookie -c cookie -X POST -d '{"title":"Help", "description": "my listing", "duration": "1"}' localhost:3000/listings/new
