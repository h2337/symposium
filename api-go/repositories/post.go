package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
)

func CreatePost(userID uint32, threadID uint32, content string) (int64, error) {
	sql := "INSERT INTO posts (user_id, thread_id, content, post_number) VALUES ($1, $2, $3, (SELECT COALESCE(MAX(post_number), 0) FROM posts WHERE thread_id = $2) + 1)"
	res, err := database.Database.Exec(sql, userID, threadID, content)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new post, error: " + err.Error())
		return 0, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		logger.Log.Error("Failed to get ID of newly INSERTed post, error: " + err.Error())
		return 0, err
	}
	return id, nil
}
