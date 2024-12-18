package repositories

import (
	"github.com/jafarlihi/symposium/api/database"
	"github.com/jafarlihi/symposium/api/logger"
	"github.com/jafarlihi/symposium/api/models"
)

func GetCategories() ([]*models.Category, error) {
	sql := "SELECT id, name, color FROM categories"
	rows, err := database.Database.Query(sql)
	if err != nil {
		logger.Log.Error("Failed to SELECT categories, error: " + err.Error())
		return nil, err
	}
	defer rows.Close()
	categories := make([]*models.Category, 0)
	for rows.Next() {
		category := &models.Category{}
		if err := rows.Scan(&category.ID, &category.Name, &category.Color); err != nil {
			logger.Log.Error("Failed to scan SELECTed row of categories, error: " + err.Error())
			return nil, err
		}
		categories = append(categories, category)
	}
	return categories, nil
}

func CreateCategory(name string, color string) (int64, error) {
	sql := "INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING id"
	var id int64
	err := database.Database.QueryRow(sql, name, color).Scan(&id)
	if err != nil {
		logger.Log.Error("Failed to INSERT a new category, error: " + err.Error())
		return 0, err
	}
	return id, nil
}

func DeleteCategory(id uint32) error {
	sql := "DELETE FROM categories WHERE id = $1"
	_, err := database.Database.Exec(sql, id)
	if err != nil {
		logger.Log.Error("Failed to DELETE a category, error: " + err.Error())
		return err
	}
	return nil
}
