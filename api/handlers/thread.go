package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/jafarlihi/symposium/backend/config"
	"github.com/jafarlihi/symposium/backend/repositories"
	"io"
	"net/http"
	"strconv"
)

func GetThread(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	idString := params["id"]
	id, err := strconv.ParseUint(idString, 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Provided ID can't be parsed as an integer"}`)
		return
	}
	thread, err := repositories.GetThread(uint32(id))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the thread"}`)
		return
	}
	jsonResult, err := json.Marshal(thread)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

func GetThreads(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	if queryParams["page"][0] == "" || queryParams["pageSize"][0] == "" {
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
	threads, err := repositories.GetThreads(uint32(page), uint32(pageSize))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the threads"}`)
		return
	}
	jsonResult, err := json.Marshal(threads)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

type threadCreationRequest struct {
	Token      string `json:"token"`
	Title      string `json:"title"`
	CategoryID uint32 `json:"categoryID"`
	Content    string `json:"content"`
}

func CreateThread(w http.ResponseWriter, r *http.Request) {
	var tcr threadCreationRequest
	err := json.NewDecoder(r.Body).Decode(&tcr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if tcr.Token == "" || tcr.Title == "" || tcr.CategoryID == 0 || tcr.Content == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Token, name, categoryID, and/or content field(s) is/are missing"}`)
		return
	}
	token, err := jwt.Parse(tcr.Token, func(token *jwt.Token) (interface{}, error) {
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
	threadID, err := repositories.CreateThread(uint32(userID), tcr.Title, tcr.CategoryID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to create the thread"}`)
		return
	}
	_, err = repositories.CreatePost(uint32(userID), uint32(threadID), tcr.Content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to create the initial post"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
