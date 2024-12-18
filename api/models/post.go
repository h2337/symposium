package models

import (
	"time"
)

type Post struct {
	ID         uint32
	UserID     uint32
	ThreadID   uint32
	PostNumber uint32
	Content    string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
