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
	"strings"
)

func main() {
	logger.InitLogger()
	config.InitConfig()
	database.InitDatabase()
	websocket.InitChannels()

	router := mux.NewRouter()
	router.HandleFunc("/api/setting", handlers.GetSettings).Methods("GET")
	router.HandleFunc("/api/setting", handlers.ChangeSettings).Methods("POST")
	router.HandleFunc("/api/token", handlers.CreateToken).Methods("POST")
	router.HandleFunc("/api/category", handlers.GetCategories).Methods("GET")
	router.HandleFunc("/api/category", handlers.CreateCategory).Methods("POST")
	router.HandleFunc("/api/category", handlers.DeleteCategory).Methods("DELETE")
	router.HandleFunc("/api/thread", handlers.CreateThread).Methods("POST")
	router.HandleFunc("/api/thread", handlers.GetThreads).Methods("GET")
	router.HandleFunc("/api/thread/{id}", handlers.GetThread).Methods("GET")
	router.HandleFunc("/api/post", handlers.CreatePost).Methods("POST")
	router.HandleFunc("/api/post", handlers.GetPosts).Methods("GET")
	router.HandleFunc("/api/post/{id}", handlers.UpdatePost).Methods("PATCH")
	router.HandleFunc("/api/user", handlers.CreateUser).Methods("POST")
	router.HandleFunc("/api/user/{id}", handlers.GetUser).Methods("GET")
	router.HandleFunc("/api/user/avatar", handlers.UploadAvatar).Methods("POST")
	router.HandleFunc("/api/follow", handlers.GetFollow).Methods("GET")
	router.HandleFunc("/api/follow", handlers.Follow).Methods("POST")
	router.HandleFunc("/api/follow", handlers.Unfollow).Methods("DELETE")
	router.HandleFunc("/api/notification", handlers.GetNotifications).Methods("GET")
	router.HandleFunc("/api/notification/unseenCount", handlers.GetUnseenNotificationCount).Methods("GET")
	router.HandleFunc("/api/notification", handlers.MarkNotificationsSeen).Methods("POST")
	router.HandleFunc("/api/ws/thread", websocket.HandleWebsocket)
	router.PathPrefix("/avatars").Handler(http.FileServer(http.Dir("./public/")))
	router.PathPrefix("/fonts").Handler(http.FileServer(http.Dir("./public/")))
	router.HandleFunc("/{path:.*}", func(w http.ResponseWriter, r *http.Request) {
		if hasSuffix(r.URL.Path, []string{"js", "ttf", "woff2", "woff", "eot"}) == false {
			http.ServeFile(w, r, "./public/index.html")
		} else {
			http.ServeFile(w, r, "./public/"+r.URL.Path)
		}
	})

	origins := gorillaHandlers.AllowedOrigins([]string{"*"})
	headers := gorillaHandlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := gorillaHandlers.AllowedMethods([]string{"GET", "POST", "DELETE", "PATCH"})

	logger.Log.Info("Starting HTTP server listening at " + config.Config.HttpServer.Port)
	logger.Log.Critical(http.ListenAndServe(":"+config.Config.HttpServer.Port, gorillaHandlers.CORS(origins, headers, methods)(router)))
}

func hasSuffix(path string, parts []string) bool {
	for _, part := range parts {
		if strings.HasSuffix(path, part) == true {
			return true
		}
	}
	return false
}
