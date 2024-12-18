package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jafarlihi/symposium/api/config"
	"github.com/jafarlihi/symposium/api/models"
	"github.com/jafarlihi/symposium/api/repositories"
	"io"
	"net/http"
	"strconv"
	"strings"
)

func GetNotifications(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	if len(queryParams["page"]) == 0 || queryParams["page"][0] == "" || len(queryParams["pageSize"]) == 0 || queryParams["pageSize"][0] == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "page and/or pageSize query parameters are missing"}`)
		return
	}
	page, err := strconv.ParseUint(queryParams["page"][0], 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "page query parameter couldn't be parsed as an integer"}`)
		return
	}
	pageSize, err := strconv.ParseUint(queryParams["pageSize"][0], 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "pageSize query parameter couldn't be parsed as an integer"}`)
		return
	}
	tokenHeader := r.Header.Get("Authorization")
	tokenFields := strings.Fields(tokenHeader)
	if len(tokenFields) != 2 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error: "Token is missing"}`)
		return
	}
	tokenString := tokenFields[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
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
	var notifications []*models.Notification
	notifications, err = repositories.GetNotificationsByUserID(uint32(userID), uint32(page), uint32(pageSize))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the notifications"}`)
		return
	}
	jsonResult, err := json.Marshal(notifications)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

func GetUnseenNotificationCount(w http.ResponseWriter, r *http.Request) {
	tokenHeader := r.Header.Get("Authorization")
	tokenFields := strings.Fields(tokenHeader)
	if len(tokenFields) != 2 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error: "Token is missing"}`)
		return
	}
	tokenString := tokenFields[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
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
	count, err := repositories.GetUnseenNotificationCountByUserID(uint32(userID))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the notifications"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, "{\"count\": "+strconv.Itoa(count)+"}")
}

type markNotificationsSeenRequest struct {
	IDs []int `json:"ids"`
}

func MarkNotificationsSeen(w http.ResponseWriter, r *http.Request) {
	tokenHeader := r.Header.Get("Authorization")
	tokenFields := strings.Fields(tokenHeader)
	if len(tokenFields) != 2 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error: "Token is missing"}`)
		return
	}
	tokenString := tokenFields[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
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
	var mnsr markNotificationsSeenRequest
	err = json.NewDecoder(r.Body).Decode(&mnsr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if len(mnsr.IDs) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "IDs field is missing or is empty"}`)
		return
	}
	err = repositories.MarkNotificationsSeen(uint32(userID), mnsr.IDs)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to mark notifications seen"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
