package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
	"github.com/jafarlihi/symposium/backend/models"
)

func GetUserByUsername(username string) (*models.User, error) {
	sql := "SELECT id, username, email, password, access FROM users where username = $1"
	row := database.Database.QueryRow(sql, username)
	var user models.User
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Access)
	if err != nil {
		logger.Log.Error("Failed to SELECT a password, error: " + err.Error())
		return nil, err
	}
	return &user, nil
}

func CreateUser(username string, email string, password string) error {
	sql := "INSERT INTO users (username, email, password, access) VALUES ($1, $2, $3, 0)"
	_, err := database.Database.Exec(sql, username, email, password)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new user, error: " + err.Error())
		return err
	}
	return nil
}
