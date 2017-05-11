#!/bin/sh
curl -H "Content-Type: application/json" -b cookie -c cookie -X GET localhost:3000/listings
