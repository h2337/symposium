package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
	"github.com/lib/pq"
)

func GetNotificationsByUserID(userID uint32, page uint32, pageSize uint32) ([]*models.Notification, error) {
	sql := "SELECT n.id, nt.id, nt.name, n.user_id, n.content, n.link, n.thread_id, n.post_id, n.seen, n.created_at FROM notifications n LEFT JOIN notification_types nt ON n.type = nt.id WHERE n.user_id = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3"
	rows, err := database.Database.Query(sql, userID, page*pageSize, pageSize)
	if err != nil {
		logger.Log.Error("Failed to SELECT notifications, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	notifications := make([]*models.Notification, 0)
	for rows.Next() {
		notification := &models.Notification{}
		notification.Type = models.NotificationType{}
		if err := rows.Scan(&notification.ID, &notification.Type.ID, &notification.Type.Name, &notification.UserID, &notification.Content, &notification.Link, &notification.ThreadID, &notification.PostID, &notification.Seen, &notification.CreatedAt); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of notifications, error: " + err.Error())
			return nil, err
		}
		notifications = append(notifications, notification)
	}
	return notifications, nil
}

func GetUnseenNotificationCountByUserID(userID uint32) (int, error) {
	sql := "SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND seen = false"
	row := database.Database.QueryRow(sql, userID)
	var count int
	err := row.Scan(&count)
	if err != nil {
		logger.Log.Error("Failed to scan SELECTed row of notifications, error: " + err.Error())
		return 0, err
	}
	return count, nil
}

func MarkNotificationsSeen(userID uint32, IDs []int) error {
	sql := "UPDATE notifications SET seen = true WHERE user_id = $1 AND id = ANY($2)"
	_, err := database.Database.Exec(sql, userID, pq.Array(IDs))
	if err != nil {
		logger.Log.Error("Failed to UPDATE notifications, error: " + err.Error())
		return err
	}
	return nil
}

func CreateThreadFollowNotification(userID uint32, content string, link string, threadID uint32, postID uint32) (int64, error) {
	sql := "INSERT INTO notifications (type, user_id, content, link, thread_id, post_id) VALUES (1, $1, $2, $3, $4, $5) RETURNING id"
	var id int64
	err := database.Database.QueryRow(sql, userID, content, link, threadID, postID).Scan(&id)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new notification, error: " + err.Error())
		return 0, err
	}
	return id, nil
}

func DeleteNotificationsByThreadID(threadID uint32) error {
	sql := "DELETE FROM notifications WHERE thread_id = $1"
	_, err := database.Database.Exec(sql, threadID)
	if err != nil {
		logger.Log.Error("Failed to DELETE a notification, error: " + err.Error())
		return err
	}
	return nil
}
