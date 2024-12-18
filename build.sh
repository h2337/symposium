#/usr/bin/env bash

export API_URL=127.0.0.1:8081

mkdir build
cd ./api/ && go build && cp ./api ../build && cp -R ./public ../build && cp ./config.json ../build && cp ./schema.sql ../build && cd ..
cd ./ui/ && npm install && npm run build && cp -R ./dist/* ../build/public
