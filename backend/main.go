package main

import (
	"log"
	"encoding/json"
	"net/http"
	"fmt"
	//"os"
	"github.com/joho/godotenv"
)

type RequestBody struct {
	Number  string
	Street  string  
	Type    string
	City    string
	State   string
	Zipcode string
}

func init() {

    err := godotenv.Load(".env")

    if err != nil {
        log.Fatal("Error loading .env file")
    }
}

func main() {
	var envs map[string]string;
	envs, err := godotenv.Read(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}




	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		var body RequestBody
		err := json.NewDecoder(req.Body).Decode(&body)
		if err != nil {
			log.Println("Ayo, error")
		}
		fmt.Printf(envs["PORT"])
		
		json, err := json.Marshal(body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		w.Write(json)
	})

	log.Println("Server is available at http://localhost:8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}


