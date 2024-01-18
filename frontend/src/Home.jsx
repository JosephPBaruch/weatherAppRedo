import React from 'react'
import {render} from 'react-dom'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import StyledInput  from './inputs'

const styles = (theme) => ({    
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
  },
  top: {
    width: 400, 
    height: "100px", 
    align: "top",
    left: "0", 
    justifyContent: "center", 
    top: "0", 
    //position: "fixed",
    margin: "20px", 
    display: "block"
  }, 
  input: {
    width: "200px", 
    left: "0", 
    margin: "10px", 
    padding: "0", 
    border: "solid black 2px", 
    height: "700px" ,
    width: "250px", 
    bottom: "0",
    display: "block"
  }, 
  collapse: {
    position: "fixed",
    bottom: "0", 
    width: "80px", 
    height: "40px", 
    margin: "10px", 
    fontSize: "10px", 
    left: "0"
  }, 
  go: {
    height: '20px', 
    width: '150px', 
    margin: "10px", 
    fontSize: "10px", 
    text: "flex"
  }, 
  inputBox: {
    width: '150px', 
    height: '20px',
    margin: '10px'

  }
})

function Comp({classes}){

    const [state, setState] = useState(true);

    const collChange = (args) => {
        setState({
            ...state, 
            ...args, 
        });

        
    }
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
      ]);
    
      useEffect(() => {
        const handleWindowResize = () => {
          setWindowSize([window.innerWidth, window.innerHeight]);
        };
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
      }, []);
//
    return (
        <div>
            <div className={classes.top} style={{width: `${windowSize[0]}px`, height: `${windowSize[1] * .1 }px` }} > 
                <h1>We Weather</h1>
            </div>
            <div className={classes.inputSection}  >
                <button className={classes.collapse}onClick={() => collChange({open: !state.open})}> Collapse </button>
                {!state.open && <StyledInput style={{margin: "10px"}}/> }
            </div>
            
        </div>
    )
}

const StyledComp = injectSheet(styles)(Comp)
const theme = {
  background: '#aaa',
  color: '#24292e'
}

const Home = () => (
  <ThemeProvider theme={theme} >
    <StyledComp color="blue"/>
  </ThemeProvider>
)

export default Home;