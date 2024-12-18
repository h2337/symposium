package websocket

import (
	"github.com/jafarlihi/symposium/api/models"
)

var ThreadChannel chan *models.Thread

func InitChannels() {
	ThreadChannel = make(chan *models.Thread)
}
