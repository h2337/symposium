package models

import (
	"time"
)

type Thread struct {
	ID         uint32    `json:"id"`
	UserID     uint32    `json:"userID"`
	Title      string    `json:"title"`
	CategoryID uint32    `json:"categoryID"`
	CreatedAt  time.Time `json:"createdAt"`
}
