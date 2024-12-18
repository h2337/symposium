package handlers

import (
	"encoding/json"
	"github.com/jafarlihi/symposium/api/models"
	"github.com/jafarlihi/symposium/api/repositories"
	"io"
	"net/http"
)

func GetSettings(w http.ResponseWriter, r *http.Request) {
	var settings []*models.Setting
	settings, err := repositories.GetSettings()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to fetch the settings"}`)
		return
	}
	var settingsMap map[string]string
	settingsMap = make(map[string]string)
	for _, setting := range settings {
		settingsMap[setting.Name] = setting.Value
	}
	result, err := json.Marshal(settingsMap)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal result as JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(result))
}
