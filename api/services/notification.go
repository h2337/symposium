package services

import (
	"fmt"
	"github.com/jafarlihi/symposium/api/repositories"
)

func EmitThreadFollowNotifications(userID uint32, postID uint32, threadID uint32) error {
	follows, err := repositories.GetFollowsByThreadID(threadID)
	if err != nil {
		return err
	}
	thread, err := repositories.GetThread(threadID)
	if err != nil {
		return err
	}
	for _, v := range follows {
		if v.UserID == userID {
			continue
		}
		_, _ = repositories.CreateThreadFollowNotification(v.UserID, "New post in a followed thread '"+thread.Title+"'", "/thread/"+fmt.Sprint(threadID), threadID, postID)
	}
	return nil
}
