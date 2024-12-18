package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jafarlihi/symposium/api/config"
	"github.com/jafarlihi/symposium/api/repositories"
	"io"
	"net/http"
	"strings"
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
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

type categoryDeletionRequest struct {
	ID uint32 `json:"id"`
}

func DeleteCategory(w http.ResponseWriter, r *http.Request) {
	var cdr categoryDeletionRequest
	err := json.NewDecoder(r.Body).Decode(&cdr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if cdr.ID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "CategoryID parameter is missing"}`)
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
	user, err := repositories.GetUser(uint32(userID))
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
	threads, err := repositories.GetAllThreadsByCategoryID(cdr.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to fetch the threads of the category"}`)
		return
	}
	for _, thread := range threads {
		err := repositories.DeleteNotificationsByThreadID(thread.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			io.WriteString(w, `{"error": "Failed to delete the notifications of a thread in the category"}`)
			return
		}
		err = repositories.DeleteFollowsByThreadID(thread.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			io.WriteString(w, `{"error": "Failed to delete the follow of a thread in the category"}`)
			return
		}
		err = repositories.DeletePostsByThreadID(thread.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			io.WriteString(w, `{"error": "Failed to delete the posts of a thread in the category"}`)
			return
		}
		err = repositories.DeleteThread(thread.ID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			io.WriteString(w, `{"error": "Failed to delete a thread of the category"}`)
			return
		}
	}
	err = repositories.DeleteCategory(cdr.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to delete the category"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}

type categoryCreationRequest struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}

func CreateCategory(w http.ResponseWriter, r *http.Request) {
	var ccr categoryCreationRequest
	err := json.NewDecoder(r.Body).Decode(&ccr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if ccr.Name == "" || ccr.Color == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Name, and/or color field(s) is/are missing"}`)
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
	user, err := repositories.GetUser(uint32(userID))
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
	_, err = repositories.CreateCategory(ccr.Name, ccr.Color)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to create the category"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
