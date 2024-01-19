import React from 'react'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect} from 'react'

const styles = (theme) => ({    
    top: {
      align: "top",
      left: "0", 
      justifyContent: "center", 
      top: "0", 
      margin: "20px", 
      display: "block"
    }, 
    topText: {
      textAlign: "center"
    }
  })
  
function Results({classes}){
  
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
  
      return (
          <>
          <h1 style={{right: "0"}} >hello</h1>
          </>
      )
  }
  
  const StyledResults = injectSheet(styles)(Results)
  
  export default StyledResults;