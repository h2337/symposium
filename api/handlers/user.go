package handlers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/holys/initials-avatar"
	"github.com/jafarlihi/symposium/backend/logger"
	"github.com/jafarlihi/symposium/backend/repositories"
	"golang.org/x/crypto/bcrypt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	idString := params["id"]
	id, err := strconv.ParseUint(idString, 10, 32)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Provided ID can't be parsed as an integer"}`)
		return
	}
	user, err := repositories.GetUser(uint32(id))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to get the user"}`)
		return
	}
	user.Password = ""
	jsonResult, err := json.Marshal(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to marshal the result to JSON"}`)
		return
	}
	w.WriteHeader(http.StatusOK)
	io.WriteString(w, string(jsonResult))
}

type accountCreationRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: Add validation
	var acr accountCreationRequest
	err := json.NewDecoder(r.Body).Decode(&acr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Request body couldn't be parsed as JSON"}`)
		return
	}
	if acr.Username == "" || acr.Email == "" || acr.Password == "" {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"error": "Username, email, or password field(s) is/are missing"}`)
		return
	}
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(acr.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to hash the password"}`)
		return
	}
	id, err := repositories.CreateUser(acr.Username, acr.Email, string(passwordHash))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		io.WriteString(w, `{"error": "Failed to create the user"}`)
		return
	}
	avatarConfig := avatar.Config{
		FontFile: "./public/fonts/monofonto.ttf",
		FontSize: 80,
	}
	a := avatar.NewWithConfig(avatarConfig)
	avatarBytes, _ := a.DrawToBytes(acr.Username, 128)
	err = ioutil.WriteFile("./public/avatars/"+strconv.FormatInt(id, 10)+".jpg", avatarBytes, 0644)
	if err != nil {
		logger.Log.Error("Failed to create the user avatar, error: " + err.Error())
	}
	w.WriteHeader(http.StatusOK)
}
