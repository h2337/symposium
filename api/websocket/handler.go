package websocket

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
	"net/http"
)

var upgrader = websocket.Upgrader{}

func HandleWebsocket(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(req *http.Request) bool { return true }
	connection, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Log.Error("Failed to upgrade the connection to WebSocket, error: " + err.Error())
		return
	}
	defer connection.Close()
	uuid := uuid.New()
	threadChannel := make(chan *models.Thread)
	connectionThreadChannelsMutex.Lock()
	connectionThreadChannels[uuid.String()] = threadChannel
	connectionThreadChannelsMutex.Unlock()
	for {
		thread := <-threadChannel
		jsonThread, err := json.Marshal(thread)
		if err != nil {
			logger.Log.Error("Failed to marshal new thread as JSON for emitting through WebSocket, error: " + err.Error())
			continue
		}
		err = connection.WriteMessage(1, jsonThread)
		if err != nil {
			connectionThreadChannelsMutex.Lock()
			delete(connectionThreadChannels, uuid.String())
			connectionThreadChannelsMutex.Unlock()
		}
	}
}
