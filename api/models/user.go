package models

type User struct {
	ID       uint32
	Username string
	Email    string
	Password string
	Access   uint32
}
