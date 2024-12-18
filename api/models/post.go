package models

import (
	"time"
)

type Post struct {
	ID         uint32    `json:"id"`
	UserID     uint32    `json:"userID"`
	ThreadID   uint32    `json:"threadID"`
	PostNumber uint32    `json:"postNumber"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
	Username   string    `json:"username"`
}

type PostAndThread struct {
	ID               uint32    `json:"id"`
	UserID           uint32    `json:"userID"`
	ThreadID         uint32    `json:"threadID"`
	PostNumber       uint32    `json:"postNumber"`
	Content          string    `json:"content"`
	CreatedAt        time.Time `json:"createdAt"`
	Username         string    `json:"username"`
	ThreadUserID     uint32    `json:"threadUserID"`
	ThreadTitle      string    `json:"threadTitle"`
	ThreadCategoryID uint32    `json:"threadCategoryID"`
	ThreadCreatedAt  time.Time `json:"threadCreatedAt"`
}
