package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jafarlihi/symposium/api/config"
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
	token, err := jwt.Parse(settings["token"], func(token *jwt.Token) (interface{}, error) {
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
	user, err := repositories.GetUser(uint32(userID))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to fetch the user from database"}`)
		return
	}
	if user.Access != 99 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "User lacks the necessary privileges to change the settings"}`)
		return
	}
	err = repositories.UpdateSettings(settings)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to update settings"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
