package main

import (
	gorillaHandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jafarlihi/symposium/backend/config"
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/handlers"
	"github.com/jafarlihi/symposium/backend/logger"
	"net/http"
)

func main() {
	logger.InitLogger()
	config.InitConfig()
	database.InitDatabase()

	router := mux.NewRouter()
	router.HandleFunc("/token", handlers.CreateTokenHandler).Methods("POST")
	router.HandleFunc("/account", handlers.CreateAccountHandler).Methods("POST")
	router.HandleFunc("/category", handlers.GetCategories).Methods("GET")
	router.HandleFunc("/category", handlers.CreateCategory).Methods("POST")
	router.HandleFunc("/category", handlers.DeleteCategory).Methods("DELETE")
	router.HandleFunc("/thread", handlers.CreateThread).Methods("POST")
	router.HandleFunc("/thread", handlers.GetThreads).Methods("GET")
	router.HandleFunc("/thread/{id}", handlers.GetThread).Methods("GET")
	router.HandleFunc("/post", handlers.CreatePost).Methods("POST")
	router.HandleFunc("/post", handlers.GetPosts).Methods("GET")
	router.HandleFunc("/user/{id}", handlers.GetUser).Methods("GET")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))

	origins := gorillaHandlers.AllowedOrigins([]string{"*"})
	headers := gorillaHandlers.AllowedHeaders([]string{"X-Requested-With"})
	methods := gorillaHandlers.AllowedMethods([]string{"GET", "POST", "DELETE", "PATCH"})

	logger.Log.Info("Starting HTTP server listening at " + config.Config.HttpServer.Port)
	logger.Log.Critical(http.ListenAndServe(":"+config.Config.HttpServer.Port, gorillaHandlers.CORS(origins, headers, methods)(router)))
}
