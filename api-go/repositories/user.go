package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
)

func GetPasswordAndUserIDByUsername(username string) (string, string, error) {
	sql := "SELECT password, id FROM users where username = $1"
	row := database.Database.QueryRow(sql, username)
	var password string
	var userID string
	err := row.Scan(&password, &userID)
	if err != nil {
		logger.Log.Error("Failed to SELECT a password, error: " + err.Error())
		return "", "", err
	}
	return password, userID, nil
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
