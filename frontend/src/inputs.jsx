import React from 'react'
import {render} from 'react-dom'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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

function Input({classes}){
    const navigate = useNavigate();

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

    const [ state, setState ] = useState({
        open: true,
        number: "", 
        valid: true,
        street: "", 
        type: "", 
        city: "", 
        state: "", 
        zipcode: "",
        result: null, 
        error: false, 
    })
const [ open, setOpen ] = useState(false);
    const inputChange = async (args) => {
        await setState({
            ...state, 
            ...args, 
            Result: null,
        });
        //check()

    }
    const ipv4Pattern =  /^(\d{1,3}\.){3}\d{1,3}$/; 
    var works = true; 
   // const check = () => {
        if( state.number !== "" && !ipv4Pattern.test(state.number) ){
            works = false;
            //console.log(state.number)
        }else{
            works = true; 
        }
    //}
        
    
    
    const addressPackage = {
        Number:  state.number,
        Street:  state.street, 
        Type:    state.type,
        City:    state.city,
        State:   state.state,
        Zipcode: state.zipcode,
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
        //navigate('/display', { state: {values} });    
    };

    const input = [
        {
            key: "1",
            type: "number",
        },
        {
            key: "2",
            type: "street",
        },
        {
            key: "3",
            type: "type",
        },
        {
            key: "4",
            type: "city",
        },
        {
            key: "5",
            type: "state",
        },
        {
            key: "6",
            type: "zipcode",
        } 
    ]

    const collapse = () => {
        setState({
            ...state, 
            open: false,
        })
    }
   // 
    return (
        <div className={classes.input} style={{height: `${windowSize[1] * .8 }px`}} >
            <button onClick={() => setOpen(!open)}>Collapse</button>
            {open && 
            <div> {input.map((value) => (
                <input className={classes.inputBox} key={value.key} placeholder={value.type} value={state[value.type]} onChange={() => inputChange({[value.type]: event.target.value})} />
            ))}
                        <button className={classes.go} onClick={handleClick} >Go</button> 
            </div>}
            { works && <h1>Yeah {}</h1>}

        </div>
    )
}

const StyledInput = injectSheet(styles)(Input)

export default StyledInput;