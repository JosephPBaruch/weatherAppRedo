import React from 'react'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect} from 'react'

const styles = (theme) => ({    
    top: {
      align: "top",
      //textAlign: "center",
      left: "0", 
      justifyContent: "center", 
      top: "0", 
      margin: "20px", 
      display: "block"
    }, 
    topText: {
      textAlign: "center", 
      margin: 0, 
    }, 
    div: {
        justifyContent: "center", 
        display: "block"
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
          <div  className={classes.top} style={{width: `${windowSize[0] * .7 }px`}} >
            <h2 className={classes.topText} style={{margin: 0}}>Results</h2>
          </div>
      )
  }
  
  const StyledResults = injectSheet(styles)(Results)
  
  export default StyledResults;