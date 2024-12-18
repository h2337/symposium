package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
)

func GetSettings() (map[string]string, error) {
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
	var settingsMap map[string]string
	settingsMap = make(map[string]string)
	for _, setting := range settings {
		settingsMap[setting.Name] = setting.Value
	}
	return settingsMap, nil
}

func UpdateSettings(settings map[string]string) error {
	sql := "UPDATE settings SET value = $1 WHERE name = $2"
	for k, v := range settings {
		_, err := database.Database.Exec(sql, v, k)
		if err != nil {
			logger.Log.Error("Failed to UPDATE a setting, error: " + err.Error())
			return err
		}
	}
	return nil
}
