package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/jafarlihi/symposium/backend/repositories"
	"golang.org/x/crypto/bcrypt"
	"io"
	"net/http"
)

type accountCreationRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func CreateAccountHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Add validation
	var acr accountCreationRequest
	err := json.NewDecoder(r.Body).Decode(&acr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if acr.Username == "" || acr.Email == "" || acr.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Username, email, or password field(s) is/are missing"}`)
		return
	}
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(acr.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to hash the password"}`)
		return
	}
	_, err = repositories.CreateUser(acr.Username, acr.Email, string(passwordHash))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
}
