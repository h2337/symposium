package database

import (
	"database/sql"
	"github.com/jafarlihi/symposium/api/config"
	"github.com/jafarlihi/symposium/api/logger"
	_ "github.com/lib/pq"
	"io/ioutil"
	"os"
)

var Database *sql.DB

func InitDatabase() {
	var err error
	Database, err = sql.Open("postgres", config.Config.Database.Url)
	if err != nil {
		logger.Log.Error("Failed to connect to the database, error: " + err.Error())
		os.Exit(1)
	}
	err = Database.Ping()
	if err != nil {
		logger.Log.Error("Failed to connect to the database, error: " + err.Error())
		os.Exit(1)
	}
	schemaBytes, err := ioutil.ReadFile("schema.sql")
	if err != nil {
		logger.Log.Warningf("Failed to read the schema.sql for database schema initialization. Skipping procedure. Error: " + err.Error())
		return
	}
	_, err = Database.Exec(string(schemaBytes))
	if err != nil {
		logger.Log.Warningf("Failed to (re-)initialize the schema, error: " + err.Error())
	}
}
