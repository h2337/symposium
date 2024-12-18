package websocket

import (
	"encoding/json"
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
		thread := <-ThreadChannel
		jsonThread, err := json.Marshal(thread)
		if err != nil {
			logger.Log.Error("Failed to marshal new thread as JSON for emitting through WebSocket, error: " + err.Error())
			continue
		}
		connection.WriteMessage(1, jsonThread)
	}
}
