package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
)

func GetSettings() ([]*models.Setting, error) {
	sql := "SELECT name, value FROM settings"
	rows, err := database.Database.Query(sql)
	if err != nil {
		logger.Log.Error("Failed to SELECT settings, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	settings := make([]*models.Setting, 0)
	for rows.Next() {
		setting := &models.Setting{}
		if err := rows.Scan(&setting.Name, &setting.Value); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of settings, error: " + err.Error())
			return nil, err
		}
		settings = append(settings, setting)
	}
	return settings, nil
}
