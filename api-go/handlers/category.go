package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jafarlihi/symposium/backend/config"
	"github.com/jafarlihi/symposium/backend/repositories"
	"io"
	"net/http"
)

func GetCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := repositories.GetCategories()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the categories"}`)
		return
	}
	jsonResult, err := json.Marshal(categories)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

type categoryCreationRequest struct {
	Token string `json:"token"`
	Name  string `json:"name"`
	Color string `json:"color"`
	Icon  string `json:"icon"`
}

func CreateCategory(w http.ResponseWriter, r *http.Request) {
	var ccr categoryCreationRequest
	err := json.NewDecoder(r.Body).Decode(&ccr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if ccr.Token == "" || ccr.Name == "" || ccr.Color == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Token, name, and/or color field(s) is/are missing"}`)
		return
	}
	token, err := jwt.Parse(ccr.Token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.Config.Jwt.SigningSecret), nil
	})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Failed to parse the token"}`)
		return
	}
	var userID float64
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID = claims["userID"].(float64)
	} else {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Invalid token"}`)
		return
	}
	user, err := repositories.GetUserByUserID(uint32(userID))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to fetch the user from database"}`)
		return
	}
	if user.Access != 99 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "User lacks the necessary privileges to create a category"}`)
		return
	}
	_, err = repositories.CreateCategory(ccr.Name, ccr.Color, ccr.Icon)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to create the category"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
