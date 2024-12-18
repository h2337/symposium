package main

import (
	"github.com/gorilla/mux"
	"github.com/jafarlihi/symposium/backend/config"
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/handlers"
	"github.com/jafarlihi/symposium/backend/logger"
	"net/http"
	"time"
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
	router.HandleFunc("/thread", handlers.CreateThread).Methods("POST")
	router.HandleFunc("/thread", handlers.GetThreads).Methods("GET")
	router.HandleFunc("/thread/{id}", handlers.GetThread).Methods("GET")
	server := &http.Server{
		Handler:      router,
		Addr:         config.Config.HttpServer.ListenAddress,
		WriteTimeout: time.Duration(config.Config.HttpServer.WriteTimeoutSeconds) * time.Second,
		ReadTimeout:  time.Duration(config.Config.HttpServer.ReadTimeoutSeconds) * time.Second,
	}
	logger.Log.Info("Starting HTTP server listening at " + config.Config.HttpServer.ListenAddress)
	logger.Log.Critical(server.ListenAndServe())
}
