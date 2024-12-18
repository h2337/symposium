package handlers

import (
	"github.com/gorilla/websocket"
	"github.com/jafarlihi/symposium/api/logger"
	"net/http"
)

var upgrader = websocket.Upgrader{}

func HandleWebsocket(w http.ResponseWriter, r *http.Request) {
	connection, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Log.Error("Failed to upgrade the connection to WebSocket, error: " + err.Error())
		return
	}
	defer connection.Close()
	for {
		connection.WriteMessage(1, []byte("test"))
	}
}
