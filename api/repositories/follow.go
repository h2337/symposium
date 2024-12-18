package repositories

import (
	dsql "database/sql"
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
)

func GetFollow(userID uint32, threadID uint32) (*models.Follow, error) {
	sql := "SELECT id, user_id, thread_id FROM follows WHERE user_id = $1 AND thread_id = $2"
	row := database.Database.QueryRow(sql, userID, threadID)
	var follow models.Follow
	err := row.Scan(&follow.ID, &follow.UserID, &follow.ThreadID)
	if err == dsql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		logger.Log.Error("Failed to SELECT a follow, error: " + err.Error())
		return nil, err
	}
	return &follow, nil
}

func GetFollowsByThreadID(threadID uint32) ([]*models.Follow, error) {
	sql := "SELECT id, user_id, thread_id FROM follows WHERE thread_id = $1"
	rows, err := database.Database.Query(sql, threadID)
	if err != nil {
		logger.Log.Error("Failed to SELECT follows, error: " + err.Error())
		return nil, err
	}
	follows := make([]*models.Follow, 0)
	for rows.Next() {
		follow := &models.Follow{}
		if err := rows.Scan(&follow.ID, &follow.UserID, &follow.ThreadID); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of follows, error: " + err.Error())
			return nil, err
		}
		follows = append(follows, follow)
	}
	return follows, nil

}

func DeleteFollow(userID uint32, threadID uint32) error {
	sql := "DELETE FROM follows WHERE user_id = $1 AND thread_id = $2"
	_, err := database.Database.Exec(sql, userID, threadID)
	if err != nil {
		logger.Log.Error("Failed to DELETE a follow, error: " + err.Error())
		return err
	}
	return nil
}

func CreateFollow(userID uint32, threadID uint32) (int64, error) {
	sql := "INSERT INTO follows (user_id, thread_id) VALUES ($1, $2) RETURNING id"
	var id int64
	err := database.Database.QueryRow(sql, userID, threadID).Scan(&id)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new follow, error: " + err.Error())
		return 0, err
	}
	return id, nil
}

func DeleteFollowsByThreadID(threadID uint32) error {
	sql := "DELETE FROM follows WHERE thread_id = $1"
	_, err := database.Database.Exec(sql, threadID)
	if err != nil {
		logger.Log.Error("Failed to DELETE a follow, error: " + err.Error())
		return err
	}
	return nil
}
