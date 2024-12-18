package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
)

func GetPostsByThreadID(threadID uint32, page uint32, pageSize uint32) ([]*models.Post, error) {
	sql := "SELECT p.id, p.user_id, p.thread_id, p.post_number, p.content, p.created_at, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.thread_id = $1 ORDER BY p.post_number ASC OFFSET $2 LIMIT $3"
	rows, err := database.Database.Query(sql, threadID, page*pageSize, pageSize)
	if err != nil {
		logger.Log.Error("Failed to SELECT posts, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	posts := make([]*models.Post, 0)
	for rows.Next() {
		post := &models.Post{}
		if err := rows.Scan(&post.ID, &post.UserID, &post.ThreadID, &post.PostNumber, &post.Content, &post.CreatedAt, &post.Username); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of posts, error: " + err.Error())
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func GetPostsAndThreadsByUserID(userID uint32, page uint32, pageSize uint32) ([]*models.PostAndThread, error) {
	sql := "SELECT p.id, p.user_id, p.thread_id, p.post_number, p.content, p.created_at, u.username, t.user_id, t.title, t.category_id, t.created_at FROM posts p LEFT JOIN users u ON p.user_id = u.id LEFT JOIN threads t ON p.thread_id = t.id WHERE p.user_id = $1 ORDER BY p.created_at DESC OFFSET $2 LIMIT $3"
	rows, err := database.Database.Query(sql, userID, page*pageSize, pageSize)
	if err != nil {
		logger.Log.Error("Failed to SELECT posts, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	posts := make([]*models.PostAndThread, 0)
	for rows.Next() {
		post := &models.PostAndThread{}
		if err := rows.Scan(&post.ID, &post.UserID, &post.ThreadID, &post.PostNumber, &post.Content, &post.CreatedAt, &post.Username, &post.ThreadUserID, &post.ThreadTitle, &post.ThreadCategoryID, &post.ThreadCreatedAt); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of posts, error: " + err.Error())
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func GetPostsByUserID(userID uint32, page uint32, pageSize uint32) ([]*models.Post, error) {
	sql := "SELECT p.id, p.user_id, p.thread_id, p.post_number, p.content, p.created_at, u.username FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.user_id = $1 ORDER BY p.created_at DESC OFFSET $2 LIMIT $3"
	rows, err := database.Database.Query(sql, userID, page*pageSize, pageSize)
	if err != nil {
		logger.Log.Error("Failed to SELECT posts, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	posts := make([]*models.Post, 0)
	for rows.Next() {
		post := &models.Post{}
		if err := rows.Scan(&post.ID, &post.UserID, &post.ThreadID, &post.PostNumber, &post.Content, &post.CreatedAt, &post.Username); err != nil {
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
	sql = "UPDATE threads SET post_count = post_count + 1 WHERE id = $1"
	_, err = database.Database.Exec(sql, threadID)
	if err != nil {
		logger.Log.Error("Failed to increment thread post_count, error: " + err.Error())
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

func GetPost(id uint32) (*models.Post, error) {
	sql := "SELECT id, user_id, thread_id, post_number, content, created_at FROM posts WHERE id = $1"
	row := database.Database.QueryRow(sql, id)
	var post models.Post
	err := row.Scan(&post.ID, &post.UserID, &post.ThreadID, &post.PostNumber, &post.Content, &post.CreatedAt)
	if err != nil {
		logger.Log.Error("Failed to SELECT a post, error: " + err.Error())
		return nil, err
	}
	return &post, nil
}

func UpdatePostContent(id uint32, content string) error {
	sql := "UPDATE posts SET content = $1 WHERE id = $2"
	_, err := database.Database.Exec(sql, content, id)
	if err != nil {
		logger.Log.Error("Failed to UPDATE a post, error: " + err.Error())
		return err
	}
	return nil
}
