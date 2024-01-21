package main

import (
	"log"
	"encoding/json"
	"net/http"
	"fmt"
	"github.com/joho/godotenv"
	"io"
)

type AddressComponent struct {
	LongName  string   `json:"long_name"`
	ShortName string   `json:"short_name"`
	Types     []string `json:"types"`
}

type Location struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type Viewport struct {
	Northeast Location `json:"northeast"`
	Southwest Location `json:"southwest"`
}

type Geometry struct {
	Location     Location `json:"location"`
	LocationType string   `json:"location_type"`
	Viewport     Viewport `json:"viewport"`
}

type Result struct {
	AddressComponents []AddressComponent `json:"address_components"`
	FormattedAddress  string             `json:"formatted_address"`
	Geometry          Geometry           `json:"geometry"`
	PlaceID           string             `json:"place_id"`
	Types             []string           `json:"types"`
}

type GeoResponse struct {
	Results []Result `json:"results"`
	Status  string   `json:"status"`
}

type RequestBody struct {
	Number  string
	Street  string  
	Type    string
	City    string
	State   string
}

func geoGet(key string, address RequestBody )(float64, float64, error) {
	resp, err := http.Get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address.Number + "+" + address.Street + "+" + address.Type + ",+" + address.City + ",+" + address.State + "&key=" + key)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err1 := io.ReadAll(resp.Body)
	if err1 != nil {
		log.Fatalln(err)
	}
	readable := string(body)
	var geoResp GeoResponse
	err3 := json.Unmarshal([]byte(readable), &geoResp)
	if err3 != nil {
		fmt.Println(err3)
		return 0, 0, fmt.Errorf("unexpected error")
	}
	for _, result := range geoResp.Results {
		lat := result.Geometry.Location.Lat
		lng := result.Geometry.Location.Lng
		return lat, lng, nil
	}
	return 0, 0, fmt.Errorf("unexpected error")
}

func init() {
   err := godotenv.Load(".env")
   if err != nil {
       log.Fatal("Error loading .env file")
  }
}

func addCorsHeader(res http.ResponseWriter) {
	headers := res.Header()
	headers.Set("Access-Control-Allow-Origin", "*")
	headers.Set("Access-Control-Allow-Methods", "*")
	headers.Set("Content-Type", "application/json")
	headers.Set("Access-Control-Allow-Headers", "*")
}

func main() {
	var envs map[string]string;
	envs, err := godotenv.Read(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// get api key from Meteomatics here

	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		var body RequestBody
		addCorsHeader(w)
		if req.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
    		return
		}else{
			err := json.NewDecoder(req.Body).Decode(&body)
			if err != nil {
				log.Println("Ayo, error")
			}
			lat, lng, err := geoGet(envs["GEO_KEY"], body)
			if err != nil {
				log.Fatalf("Error getting coordinates: %v", err)
			}
			fmt.Printf("Latitude: %f, Longitude: %f\n", lat, lng)
			// fetch meteomatics for weather data using the cooridnates
			// add result to body and return
		}

		json, err := json.Marshal(body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(json)
	})

	log.Println("Server is available at http://localhost:" + envs["PORT"])
	log.Fatal(http.ListenAndServe(":" + envs["PORT"], nil))
}


