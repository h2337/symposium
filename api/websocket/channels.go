package websocket

import (
	"github.com/jafarlihi/symposium/api/models"
	"sync"
)

var ThreadChannel chan *models.Thread
var connectionThreadChannels map[string]chan *models.Thread
var connectionThreadChannelsMutex sync.Mutex

func InitChannels() {
	ThreadChannel = make(chan *models.Thread)
	connectionThreadChannels = make(map[string]chan *models.Thread)
	go threadChannelFanOut()
}

func threadChannelFanOut() {
	for {
		thread := <-ThreadChannel
		for _, channel := range connectionThreadChannels {
			channel <- thread
		}
	}
}
