package main

import (
	"log"
	"encoding/json"
	"net/http"
	"fmt"
	"encoding/base64"
	"github.com/joho/godotenv"
	"io"
	"io/ioutil"
	"time"
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
// Coordinates struct to represent the coordinates data
type Coordinates struct {
	Lat    float64 `json:"lat"`
	Lon    float64 `json:"lon"`
	Dates  []Date  `json:"dates"`
}

// Date struct to represent the date and value data
type Date struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
}

// Data struct to represent the data array
type Data struct {
	Parameter string       `json:"parameter"`
	Coordinates []Coordinates `json:"coordinates"`
}

// Response struct to represent the overall JSON structure
type Response struct {
	Version        string  `json:"version"`
	User           string  `json:"user"`
	DateGenerated  string  `json:"dateGenerated"`
	Status         string  `json:"status"`
	Data           []Data  `json:"data"`
}

type AuthResponse struct {
	AccessToken string `json:"access_token"`
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
	Temp    float64
}

func auth(username string, password string)(string) {

	// URL to make the GET request to
	url := "https://login.meteomatics.com/api/v1/token"

	// Create a new HTTP client
	client := &http.Client{}

	// Create a request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return ""
	}

	// Add basic authentication header
	auth := username + ":" + password
	authEncoded := base64.StdEncoding.EncodeToString([]byte(auth))
	req.Header.Add("Authorization", "Basic "+authEncoded)

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return ""
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return ""
	}
	// Parse the response body
	var authResponse AuthResponse
	err = json.Unmarshal(body, &authResponse)
	if err != nil {
		fmt.Println("Error parsing response body:", err)
		return ""
	}
	return authResponse.AccessToken;
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

func weatherGet( lat string, lng string, key string )(float64){
	currentTime := time.Now().UTC()
	formattedTime := currentTime.Format("2006-01-02T15:04:05.000-07:00")
	
	resp, err := http.Get("https://api.meteomatics.com/" + formattedTime + "/t_2m:F/" + lat + "," + lng + "/json?access_token=" + key )
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	body, err1 := io.ReadAll(resp.Body)
	if err1 != nil {
		log.Fatalln(err)
	}
	readable := string(body)

	var response Response

	// Unmarshal the JSON data into the Response struct
	err0 := json.Unmarshal([]byte(readable), &response)
	if err0 != nil {
		fmt.Println("Error unmarshaling JSON:", err)
		return 0
	}
	val := 0.0
	for _, data := range response.Data {
		for _, coord := range data.Coordinates {
			for _, date := range coord.Dates {
				val = date.Value;
			}
		}
	}
	return val;
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

	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		var body RequestBody
		addCorsHeader(w)
		if req.Method == "OPTIONS" || req.Method == "GET" {
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
			key := auth(envs["METEOMATICS_USERNAME"], envs["METEOMATICS_PASSWORD"])
			latString := fmt.Sprintf("%f", lat)
			lngString := fmt.Sprintf("%f", lng)
			temp := weatherGet(latString, lngString, key)
			body.Temp = temp;
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



