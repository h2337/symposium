package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
)

func CreateThread(userID uint32, title string, categoryID uint32) (int64, error) {
	sql := "INSERT INTO threads (user_id, title, category_id) VALUES ($1, $2, $3)"
	res, err := database.Database.Exec(sql, userID, title, categoryID)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new thread, error: " + err.Error())
		return 0, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		logger.Log.Error("Failed to get ID of newly INSERTed thread, error: " + err.Error())
		return 0, err
	}
	return id, nil
}
