package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jafarlihi/symposium/api/config"
	"github.com/jafarlihi/symposium/api/repositories"
	"io"
	"net/http"
	"strconv"
	"strings"
)

func GetFollow(w http.ResponseWriter, r *http.Request) {
	// TODO: Add token authentication here?
	queryParams := r.URL.Query()
	if len(queryParams["userID"]) == 0 || queryParams["threadID"][0] == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "userID and/or threadID query parameters are missing"}`)
		return
	}
	userID, err := strconv.ParseUint(queryParams["userID"][0], 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "userID query parameter couldn't be parsed as an integer"}`)
		return
	}
	threadID, err := strconv.ParseUint(queryParams["threadID"][0], 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "threadID query parameter couldn't be parsed as an integer"}`)
		return
	}
	follow, err := repositories.GetFollow(uint32(userID), uint32(threadID))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to fetch the follow"}`)
		return
	}
	if follow == nil {
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, `{}`)
		return
	}
	jsonResult, err := json.Marshal(follow)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

type followRequest struct {
	UserID   uint32 `json:"userID"`
	ThreadID uint32 `json:"threadID"`
}

func Follow(w http.ResponseWriter, r *http.Request) {
	var fr followRequest
	err := json.NewDecoder(r.Body).Decode(&fr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if fr.UserID == 0 || fr.ThreadID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Token, userID, and/or threadID field(s) is/are missing"}`)
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
	if uint32(userID) != fr.UserID {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "User lacks the necessary privileges to follow"}`)
		return
	}
	_, err = repositories.CreateFollow(fr.UserID, fr.ThreadID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to follow"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}

type unfollowRequest struct {
	UserID   uint32 `json:"userID"`
	ThreadID uint32 `json:"threadID"`
}

func Unfollow(w http.ResponseWriter, r *http.Request) {
	var ufr unfollowRequest
	err := json.NewDecoder(r.Body).Decode(&ufr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if ufr.UserID == 0 || ufr.ThreadID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Token, userID, and/or threadID field(s) is/are missing"}`)
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
	if uint32(userID) != ufr.UserID {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "User lacks the necessary privileges to unfollow"}`)
		return
	}
	err = repositories.DeleteFollow(ufr.UserID, ufr.ThreadID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to unfollow"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
