package repositories

import (
	"github.com/jafarlihi/symposium/backend/database"
	"github.com/jafarlihi/symposium/backend/logger"
	"github.com/jafarlihi/symposium/backend/models"
)

func GetCategories() ([]models.Category, error) {
	sql := "SELECT id, name, color FROM categories"
	rows, err := database.Database.Query(sql)
	if err != nil {
		logger.Log.Error("Failed to SELECT categories, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	categories := make([]models.Category, 0)
	for rows.Next() {
		var category models.Category
		if err := rows.Scan(&category.ID, &category.Name, &category.Color); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of categories, error: " + err.Error())
			return nil, err
		}
		categories = append(categories, category)
	}
	return categories, nil
}
