package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
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
