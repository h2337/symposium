package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
)

func GetUserPasswordByUsername(username string) string {
	sql := "SELECT password FROM users where username = $1"
	_, err := database.Database.Query(sql, username)
	if err != nil {
		logger.Log.Error("GetUserPasswordByUsername query failed")
	}
	return "null"
}

func CreateUser(username string, email string, password string) error {
	sql := "INSERT INTO users (username, email, password, access) VALUES ($1, $2, $3, 0)"
	_, err := database.Database.Exec(sql, username, email, password)
	if err != nil {
		logger.Log.Error("Failed to insert a new user, error: " + err.Error())
		return err
	}
	return nil
}
