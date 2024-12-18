FROM golang:1.14.3
ADD api ./api
WORKDIR api
RUN CGO_ENABLED=0 go build

FROM node:14.3.0
ENV API_URL 127.0.0.1:8081
ADD ui ./ui
WORKDIR ui
RUN npm run build

FROM alpine:3.11.6
COPY api/config.json .
COPY api/schema.sql .
ADD api/public ./public
COPY --from=0 /go/api/api .
COPY --from=1 /ui/dist/* ./public/
EXPOSE 8081
CMD ["./api"]
