package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
)

func GetThreads(page uint32, pageSize uint32) ([]*models.Thread, error) {
	sql := "SELECT id, user_id, title, post_count, category_id, created_at FROM threads ORDER BY created_at DESC OFFSET $1 LIMIT $2"
	rows, err := database.Database.Query(sql, page*pageSize, pageSize)
	if err != nil {
		logger.Log.Error("Failed to SELECT threads, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	threads := make([]*models.Thread, 0)
	for rows.Next() {
		thread := &models.Thread{}
		if err := rows.Scan(&thread.ID, &thread.UserID, &thread.Title, &thread.PostCount, &thread.CategoryID, &thread.CreatedAt); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of threads, error: " + err.Error())
			return nil, err
		}
		threads = append(threads, thread)
	}
	return threads, nil
}

func GetThreadsByCategoryID(categoryID uint32, page uint32, pageSize uint32) ([]*models.Thread, error) {
	sql := "SELECT id, user_id, title, post_count, category_id, created_at FROM threads WHERE category_id = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3"
	rows, err := database.Database.Query(sql, categoryID, page*pageSize, pageSize)
	if err != nil {
		logger.Log.Error("Failed to SELECT threads, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	threads := make([]*models.Thread, 0)
	for rows.Next() {
		thread := &models.Thread{}
		if err := rows.Scan(&thread.ID, &thread.UserID, &thread.Title, &thread.PostCount, &thread.CategoryID, &thread.CreatedAt); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of threads, error: " + err.Error())
			return nil, err
		}
		threads = append(threads, thread)
	}
	return threads, nil
}

func GetAllThreadsByCategoryID(categoryID uint32) ([]*models.Thread, error) {
	sql := "SELECT id, user_id, title, post_count, category_id, created_at FROM threads WHERE category_id = $1"
	rows, err := database.Database.Query(sql, categoryID)
	if err != nil {
		logger.Log.Error("Failed to SELECT threads, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	threads := make([]*models.Thread, 0)
	for rows.Next() {
		thread := &models.Thread{}
		if err := rows.Scan(&thread.ID, &thread.UserID, &thread.Title, &thread.PostCount, &thread.CategoryID, &thread.CreatedAt); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of threads, error: " + err.Error())
			return nil, err
		}
		threads = append(threads, thread)
	}
	return threads, nil
}

func GetThread(id uint32) (*models.Thread, error) {
	sql := "SELECT id, user_id, title, post_count, category_id, created_at FROM threads WHERE id = $1"
	row := database.Database.QueryRow(sql, id)
	var thread models.Thread
	err := row.Scan(&thread.ID, &thread.UserID, &thread.Title, &thread.PostCount, &thread.CategoryID, &thread.CreatedAt)
	if err != nil {
		logger.Log.Error("Failed to SELECT a thread, error: " + err.Error())
		return nil, err
	}
	return &thread, nil
}

func CreateThread(userID uint32, title string, categoryID uint32) (int64, error) {
	sql := "INSERT INTO threads (user_id, title, category_id) VALUES ($1, $2, $3) RETURNING id"
	var id int64
	err := database.Database.QueryRow(sql, userID, title, categoryID).Scan(&id)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new thread, error: " + err.Error())
		return 0, err
	}
	return id, nil
}

func DeleteThread(id uint32) error {
	sql := "DELETE FROM threads WHERE id = $1"
	_, err := database.Database.Exec(sql, id)
	if err != nil {
		logger.Log.Error("Failed to DELETE a thread, error: " + err.Error())
		return err
	}
	return nil
}
