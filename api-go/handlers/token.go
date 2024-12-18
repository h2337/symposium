package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jafarlihi/symposium/backend/config"
	"github.com/jafarlihi/symposium/backend/repositories"
	"golang.org/x/crypto/bcrypt"
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
	user, err := repositories.GetUserByUsername(tcr.Username)
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			w.WriteHeader(http.StatusBadRequest)
			io.WriteString(w, `{"error": "User does not exist"}`)
		default:
			w.WriteHeader(http.StatusInternalServerError)
			io.WriteString(w, fmt.Sprintf(`{"error": "%s"}`, err.Error()))
		}
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(tcr.Password))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Wrong password"}`)
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": user.ID,
	})
	tokenString, err := token.SignedString([]byte(config.Config.Jwt.SigningSecret))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, fmt.Sprintf(`{"error": "Failed to create token: %s"}`, err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, fmt.Sprintf(`{"token": "%s"}`, tokenString))
}
