package models

import (
	"time"
)

type Thread struct {
	ID         uint32
	UserID     uint32
	Title      string
	CategoryID uint32
	CreatedAt  time.Time
}
