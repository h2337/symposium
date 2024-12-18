package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
	"github.com/jafarlihi/symposium/backend/models"
)

func GetThread(id uint32) (*models.Thread, error) {
	sql := "SELECT id, user_id, title, category_id, created_at FROM threads WHERE id = $1"
	row := database.Database.QueryRow(sql, id)
	var thread models.Thread
	err := row.Scan(&thread.ID, &thread.UserID, &thread.Title, &thread.CategoryID, &thread.CreatedAt)
	if err != nil {
		logger.Log.Error("Failed to SELECT a thread, error: " + err.Error())
		return nil, err
	}
	return &thread, nil
}

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
