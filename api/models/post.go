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
	UpdatedAt  time.Time `json:"updatedAt"`
}
