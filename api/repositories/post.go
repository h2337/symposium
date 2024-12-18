package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
	"github.com/jafarlihi/symposium/backend/models"
)

func GetPostsByThreadID(threadID uint32, page uint32, pageSize uint32) ([]*models.Post, error) {
	sql := "SELECT id, user_id, thread_id, post_number, content, created_at FROM posts WHERE thread_id = $1 ORDER BY post_number ASC OFFSET $2 LIMIT $3"
	rows, err := database.Database.Query(sql, threadID, page*pageSize, pageSize)
	if err != nil {
		logger.Log.Error("Failed to SELECT posts, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	posts := make([]*models.Post, 0)
	for rows.Next() {
		post := &models.Post{}
		if err := rows.Scan(&post.ID, &post.UserID, &post.ThreadID, &post.PostNumber, &post.Content, &post.CreatedAt); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of posts, error: " + err.Error())
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func CreatePost(userID uint32, threadID uint32, content string) (int64, error) {
	sql := "INSERT INTO posts (user_id, thread_id, content, post_number) VALUES ($1, $2, $3, (SELECT COALESCE(MAX(post_number), 0) FROM posts WHERE thread_id = $2) + 1) RETURNING id"
	var id int64
	err := database.Database.QueryRow(sql, userID, threadID, content).Scan(&id)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new post, error: " + err.Error())
		return 0, err
	}
	return id, nil
}

func DeletePostsByThreadID(threadID uint32) error {
	sql := "DELETE FROM posts WHERE thread_id = $1"
	_, err := database.Database.Exec(sql, threadID)
	if err != nil {
		logger.Log.Error("Failed to DELETE a post, error: " + err.Error())
		return err
	}
	return nil
}
