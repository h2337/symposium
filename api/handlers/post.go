package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/jafarlihi/symposium/api/config"
	"github.com/jafarlihi/symposium/api/repositories"
	"github.com/jafarlihi/symposium/api/services"
	"io"
	"net/http"
	"strconv"
	"strings"
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
	var posts interface{} // TODO: Why interface?
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
	if pcr.ThreadID == 0 || pcr.Content == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "threadID and/or content field(s) is/are missing"}`)
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
	_, err = repositories.GetThread(pcr.ThreadID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Thread with the provided threadID does not exist"}`)
		return
	}
	postID, err := repositories.CreatePost(uint32(userID), pcr.ThreadID, pcr.Content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to create the post"}`)
		return
	}
	_ = services.EmitThreadFollowNotifications(uint32(userID), uint32(postID), pcr.ThreadID)
	w.WriteHeader(http.StatusOK)
}

type updatePostRequest struct {
	Content string `json:"content"`
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	idString := params["id"]
	id, err := strconv.ParseUint(idString, 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Provided ID can't be parsed as an integer"}`)
		return
	}
	var upr updatePostRequest
	err = json.NewDecoder(r.Body).Decode(&upr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if upr.Content == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Content field is missing"}`)
		return
	}
	post, err := repositories.GetPost(uint32(id))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the post"}`)
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
	if user.Access != 99 && user.ID != post.UserID {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "User lacks the necessary privileges to update the post"}`)
		return
	}
	err = repositories.UpdatePostContent(post.ID, upr.Content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to update the post"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
}
