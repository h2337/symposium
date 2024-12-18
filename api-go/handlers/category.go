package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/jafarlihi/symposium/backend/repositories"
	"io"
	"net/http"
)

func GetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := repositories.GetCategories()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()))
		return
	}
	jsonResult, err := json.Marshal(categories)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, fmt.Sprintf(`{"error": "Failed to marshal result to JSON, error: %s"}`, err.Error()))
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}
