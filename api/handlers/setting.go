package handlers

import (
	"encoding/json"
	"github.com/jafarlihi/symposium/api/repositories"
	"io"
	"io/ioutil"
	"net/http"
)

func GetSettings(w http.ResponseWriter, r *http.Request) {
	settings, err := repositories.GetSettings()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to fetch the settings"}`)
		return
	}
	result, err := json.Marshal(settings)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal result as JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(result))
}

func ChangeSettings(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to read the request body"}`)
		return
	}
	var settings map[string]string
	json.Unmarshal([]byte(body), &settings)
	err = repositories.UpdateSettings(settings)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to update settings"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
