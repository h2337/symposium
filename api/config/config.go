package config

import (
	"encoding/json"
	"github.com/jafarlihi/symposium/api/logger"
	"os"
)

type jwtConfig struct {
	SigningSecret string `json:"signingSecret"`
}

type databaseConfig struct {
	Url string `json:"url"`
}

type httpServerConfig struct {
	Port string `json:"port"`
}

type configuration struct {
	Jwt        jwtConfig        `json:"jwt"`
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
