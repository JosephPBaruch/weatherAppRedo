import React from 'react'
import {render} from 'react-dom'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const styles = (theme) => ({
  center: {
    position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)', 
        textAlign: 'center'
  },
  title: {
    font: {
      size: 40,
      weight: 900,
    },
    color: props => props.color
  },
  link: {
    color: theme.color,
    '&:hover': {
      opacity: 0.5
    }
  }
})

function Comp({classes}){
    const navigate = useNavigate();

    const [ address, setAddress ] = useState({
        number: "14126", 
        street: "Rainy", 
        type: "Way", 
        city: "Boise", 
        state: "Idaho", 
        zipcode: "83714",
    })

    const handleNumChange = (event) => {
        setAddress({
            ...address, 
            number: event.target.value,

        });
    }
    const handleStreetChange = (event) => {
        setAddress({
            ...address, 
            street: event.target.value,

        });
    }
    const handleTypeChange = (event) => {
        setAddress({
            ...address, 
            type: event.target.value,

        });
    }
    const handleCityChange = (event) => {
        setAddress({
            ...address, 
            city: event.target.value,

        });
    }
    const handleStateChange = (event) => {
        setAddress({
            ...address, 
            state: event.target.value,

        });
    }
    const handleZipChange = (event) => {
        setAddress({
            ...address, 
            zipcode: event.target.value,

        });
    }

    const addressPackage = {
        Number:  address.number,
        Street:  address.street, 
        Type:    address.type,
        City:    address.city,
        State:   address.state,
        Zipcode: address.zipcode,
    }

    const handleClick = async () => {
        let values = await fetch('http://localhost:8000/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(addressPackage)
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        navigate('/display', { state: {values} });    
    };

    return (
        <div className={classes.center}>
            <h1>We Weather</h1>
            <div id="center" className={classes.link}>
                <input id="jeff" style={{height: "100%", width: "100px"}} value={address.number} onChange={handleNumChange} ></input>
                <input id="jeff" style={{height: "100%", width: "100px"}} value={address.street} onChange={handleStreetChange} ></input>
                <input id="jeff" style={{height: "100%", width: "100px"}} value={address.type} onChange={handleTypeChange} ></input>
                <input id="jeff" style={{height: "100%", width: "100px"}} value={address.city} onChange={handleCityChange} ></input>
                <input id="jeff" style={{height: "100%", width: "100px"}} value={address.state} onChange={handleStateChange} ></input>
                <input id="jeff" style={{height: "100%", width: "100px"}} value={address.zipcode} onChange={handleZipChange} ></input>
                <button id="butt" onClick={handleClick}>Go</button> 
            </div>
            <footer><p>By Joseph Baruch</p></footer>
        </div>
    )
}
const StyledComp = injectSheet(styles)(Comp)
const theme = {
  background: '#aaa',
  color: '#24292e'
}

const Home = () => (
  <ThemeProvider theme={theme}>
    <StyledComp color="blue"/>
  </ThemeProvider>
)

export default Home