package handlers

import (
	"encoding/json"
	"io"
	"net/http"
)

type tokenCreationRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func CreateTokenHandler(w http.ResponseWriter, r *http.Request) {
	var tcr tokenCreationRequest
	err := json.NewDecoder(r.Body).Decode(&tcr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if tcr.Username == "" && tcr.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Username and email fields are missing, at least one is required"}`)
		return
	}
	if tcr.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Password field is missing"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, `{"token": "whatever"}`)
}
