package main

import (
	"log"
	"encoding/json"
	"net/http"
)

type RequestBody struct {
	Number  string
	Street  string  
	Type    string
	City    string
	State   string
	Zipcode string
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		var body RequestBody
		err := json.NewDecoder(req.Body).Decode(&body)
		if err != nil {
			log.Println("Ayo, error")
		}
		
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
