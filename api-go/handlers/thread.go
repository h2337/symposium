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
		io.WriteString(w, `{"error": "Failed to get the thread"`)
		return
	}
	jsonResult, err := json.Marshal(thread)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

func GetThreads(w http.ResponseWriter, r *http.Request) {
	fmt.Println("getthreads")
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
		io.WriteString(w, fmt.Sprintf(`{"error": "Failed to parse the token, error: %s"}`, err.Error()))
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
