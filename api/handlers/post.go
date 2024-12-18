package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/jafarlihi/symposium/backend/config"
	"github.com/jafarlihi/symposium/backend/repositories"
	"io"
	"net/http"
	"strconv"
)

func GetPosts(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	if len(queryParams["page"]) == 0 || queryParams["page"][0] == "" || len(queryParams["pageSize"]) == 0 || queryParams["pageSize"][0] == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "page and/or pageSize query parameters are missing"}`)
		return
	}
	threadIDExists := len(queryParams["threadID"]) != 0 && queryParams["threadID"][0] != ""
	userIDExists := len(queryParams["userID"]) != 0 && queryParams["userID"][0] != ""
	if !threadIDExists && !userIDExists {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "threadID or userID query parameter is required"}`)
		return
	}
	if threadIDExists && userIDExists {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Both threadID and userID query parameters are present, only one is required"}`)
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
	var threadID uint64
	if threadIDExists {
		threadID, err = strconv.ParseUint(queryParams["threadID"][0], 10, 32)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			io.WriteString(w, `{"error": "threadID query parameter couldn't be parsed as an integer"}`)
			return
		}
	}
	var userID uint64
	if userIDExists {
		userID, err = strconv.ParseUint(queryParams["userID"][0], 10, 32)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			io.WriteString(w, `{"error": "userID query parameter couldn't be parsed as an integer"}`)
			return
		}
	}
	var posts interface{}
	if threadIDExists {
		posts, err = repositories.GetPostsByThreadID(uint32(threadID), uint32(page), uint32(pageSize))
	}
	if userIDExists {
		posts, err = repositories.GetPostsAndThreadsByUserID(uint32(userID), uint32(page), uint32(pageSize))
	}
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the posts"}`)
		return
	}
	jsonResult, err := json.Marshal(posts)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

type postCreationRequest struct {
	Token    string `json:"token"`
	ThreadID uint32 `json:"threadID"`
	Content  string `json:"content"`
}

func CreatePost(w http.ResponseWriter, r *http.Request) {
	var pcr postCreationRequest
	err := json.NewDecoder(r.Body).Decode(&pcr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if pcr.Token == "" || pcr.ThreadID == 0 || pcr.Content == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Token, threadID, and/or content field(s) is/are missing"}`)
		return
	}
	token, err := jwt.Parse(pcr.Token, func(token *jwt.Token) (interface{}, error) {
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
	_, err = repositories.GetThread(pcr.ThreadID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Thread with the provided threadID does not exist"}`)
		return
	}
	_, err = repositories.CreatePost(uint32(userID), pcr.ThreadID, pcr.Content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to create the post"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
