import React from 'react'
import {render} from 'react-dom'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

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

    //const navigate = useNavigate();
    let location = useLocation();
    let address = location.state;

    const handleClick = () => {
       //navigate('/display');
       console.log(address)
    };

    return (
        <div className={classes.center}>
            <h1>Hot Stock</h1>

               <button id="butt" onClick={handleClick}>Go</button> 
            <footer><p>By Joseph Baruch</p></footer>
        </div>
    )
}
const StyledComp = injectSheet(styles)(Comp)
const theme = {
  background: '#aaa',
  color: '#24292e'
}

const Display = () => (
  <ThemeProvider theme={theme}>
    <StyledComp color="blue"/>
  </ThemeProvider>
)

export default Display