package config

import (
	"encoding/json"
	"github.com/jafarlihi/symposium/backend/logger"
	"os"
)

type databaseConfig struct {
	Url string `json:"url"`
}

type httpServerConfig struct {
	ListenAddress       string `json:"listenAddress"`
	WriteTimeoutSeconds int    `json:"writeTimeoutSeconds"`
	ReadTimeoutSeconds  int    `json:"readTimeoutSeconds"`
}

type configuration struct {
	Database   databaseConfig   `json:"database"`
	HttpServer httpServerConfig `json:"httpServer"`
}

var Config configuration

func InitConfig() {
	configFile, err := os.Open("./config.json")
	if err != nil {
		logger.Log.Error("Failed to open the config file, error: " + err.Error())
		os.Exit(1)
	}
	defer configFile.Close()
	jsonParser := json.NewDecoder(configFile)
	err = jsonParser.Decode(&Config)
	if err != nil {
		logger.Log.Error("Failed to decode the config file, error: " + err.Error())
		os.Exit(1)
	}
}
