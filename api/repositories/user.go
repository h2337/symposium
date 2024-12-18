package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
)

func GetUser(id uint32) (*models.User, error) {
	sql := "SELECT id, username, email, password, access FROM users WHERE id = $1"
	row := database.Database.QueryRow(sql, id)
	var user models.User
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Access)
	if err != nil {
		logger.Log.Error("Failed to SELECT a user, error: " + err.Error())
		return nil, err
	}
	return &user, nil
}

func GetUserByUsername(username string) (*models.User, error) {
	sql := "SELECT id, username, email, password, access FROM users WHERE username = $1"
	row := database.Database.QueryRow(sql, username)
	var user models.User
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Access)
	if err != nil {
		logger.Log.Error("Failed to SELECT a user, error: " + err.Error())
		return nil, err
	}
	return &user, nil
}

func CreateUser(username string, email string, password string, access int) (int64, error) {
	sql := "INSERT INTO users (username, email, password, access) VALUES ($1, $2, $3, $4) RETURNING id"
	var id int64
	err := database.Database.QueryRow(sql, username, email, password, access).Scan(&id)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new user, error: " + err.Error())
		return 0, err
	}
	return id, nil
}
