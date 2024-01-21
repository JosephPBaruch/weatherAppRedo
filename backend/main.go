package main

import (
	"log"
	"encoding/json"
	"net/http"
	"fmt"
	//////"os"
	//"reflect"
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


func geoGet(key string, address RequestBody ) {
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
	//var results []Result
	//jsonStr := `{"results":[{"address_components":[{"long_name":"318","short_name":"318","types":["street_number"]},{"long_name":"Asbury Street","short_name":"Asbury St","types":["route"]},{"long_name":"Moscow","short_name":"Moscow","types":["locality","political"]},{"long_name":"Latah County","short_name":"Latah County","types":["administrative_area_level_2","political"]},{"long_name":"Idaho","short_name":"ID","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"83843","short_name":"83843","types":["postal_code"]}],"formatted_address":"318 Asbury St, Moscow, ID 83843, USA","geometry":{"location":{"lat":46.7318624,"lng":-117.0051222},"location_type":"RANGE_INTERPOLATED","viewport":{"northeast":{"lat":46.7332103802915,"lng":-117.0039089197085},"southwest":{"lat":46.7305124197085,"lng":-117.0066068802915}}},"place_id":"EiQzMTggQXNidXJ5IFN0LCBNb3Njb3csIElEIDgzODQzLCBVU0EiMRIvChQKEgkpTcRGfyegVBENsU_aJxSmxxC-AioUChIJyb2bS34noFQRAhScD9BheKU","types":["street_address"]}],"status":"OK"}`
	var geoResp GeoResponse
	err3 := json.Unmarshal([]byte(readable), &geoResp)
	if err3 != nil {
		fmt.Println(err3)
		return
	}

	fmt.Print(geoResp.Results[0].FormattedAddressf)
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
		if req.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
    		return
		}else{
			err := json.NewDecoder(req.Body).Decode(&body)
			if err != nil {
				log.Println("Ayo, error")
			}
			geoGet(envs["GEO_KEY"], body)

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


