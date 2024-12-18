package models

import (
	"database/sql"
	"time"
)

type Notification struct {
	ID        uint32           `json:"id"`
	Type      NotificationType `json:"type"`
	UserID    uint32           `json:"userID"`
	Content   string           `json:"content"`
	Link      string           `json:"link"`
	ThreadID  sql.NullInt32    `json:"threadID"`
	PostID    sql.NullInt32    `json:"postID"`
	Seen      bool             `json:"seen"`
	CreatedAt time.Time        `json:"createdAt"`
}
