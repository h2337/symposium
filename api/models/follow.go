package models

type Follow struct {
	ID       uint32 `json:"id"`
	UserID   uint32 `json:"userID"`
	ThreadID uint32 `json:"threadID"`
}
