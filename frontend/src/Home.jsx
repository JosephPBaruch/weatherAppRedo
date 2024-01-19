import React from 'react'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect} from 'react'
import StyledInput  from './inputs'
import StyledResults from './Results'

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

function Comp({classes}){

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
            <div className={classes.top} style={{width: `${windowSize[0]}px`, height: `${windowSize[1] * .1 }px` }} > 
                <h1 className={classes.topText} >We Weather</h1>
            </div>
            <StyledResults style={{float: "right"}} />
            <StyledInput /> 
    
        </>
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