package main

import (
	gorillaHandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jafarlihi/symposium/api/config"
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/handlers"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/websocket"
	"net/http"
)

func main() {
	logger.InitLogger()
	config.InitConfig()
	database.InitDatabase()
	websocket.InitChannels()

	router := mux.NewRouter()
	router.HandleFunc("/setting", handlers.GetSettings).Methods("GET")
	router.HandleFunc("/setting", handlers.ChangeSettings).Methods("POST")
	router.HandleFunc("/token", handlers.CreateToken).Methods("POST")
	router.HandleFunc("/category", handlers.GetCategories).Methods("GET")
	router.HandleFunc("/category", handlers.CreateCategory).Methods("POST")
	router.HandleFunc("/category", handlers.DeleteCategory).Methods("DELETE")
	router.HandleFunc("/thread", handlers.CreateThread).Methods("POST")
	router.HandleFunc("/thread", handlers.GetThreads).Methods("GET")
	router.HandleFunc("/thread/{id}", handlers.GetThread).Methods("GET")
	router.HandleFunc("/post", handlers.CreatePost).Methods("POST")
	router.HandleFunc("/post", handlers.GetPosts).Methods("GET")
	router.HandleFunc("/user", handlers.CreateUser).Methods("POST")
	router.HandleFunc("/user/{id}", handlers.GetUser).Methods("GET")
	router.HandleFunc("/user/avatar", handlers.UploadAvatar).Methods("POST")
	router.HandleFunc("/ws/thread", websocket.HandleWebsocket)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))

	origins := gorillaHandlers.AllowedOrigins([]string{"*"})
	headers := gorillaHandlers.AllowedHeaders([]string{"X-Requested-With"})
	methods := gorillaHandlers.AllowedMethods([]string{"GET", "POST", "DELETE", "PATCH"})

	logger.Log.Info("Starting HTTP server listening at " + config.Config.HttpServer.Port)
	logger.Log.Critical(http.ListenAndServe(":"+config.Config.HttpServer.Port, gorillaHandlers.CORS(origins, headers, methods)(router)))
}
