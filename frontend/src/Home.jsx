import React from 'react'
import {render} from 'react-dom'
import injectSheet, { ThemeProvider } from 'react-jss'
import { useState, useEffect } from 'react'
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
    width: "100%", 
    height: "10%", 
    align: "top",
    left: "0", 
    justifyContent: "center", 
    top: "0", 
    position: "fixed", 
    padding: "0", 
    margin: "20px 0 20px 0"

  }, 
  input: {
    width: "50px", 
    left: "0", 
    margin: "10px 0 0 0 "
  }
})

function Input({classes}){
    const navigate = useNavigate();

    const [ state, setState ] = useState({
        open: true,
        number: "", 
        street: "", 
        type: "", 
        city: "", 
        state: "", 
        zipcode: "",
        result: null, 
    })

    const inputChange = (args) => {
        setState({
            ...state, 
            ...args, 
            Result: null,
        });
    }
    

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
        navigate('/display', { state: {values} });    
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

    return (
        <div style={{ margin: 0}}>
            <div className={classes.input}>
                {input.map((value) => (
                    <input key={value.key} placeholder={value.type} value={state[value.type]} onChange={() => inputChange({[value.type]: event.target.value})} />
                ))

                }
                <button id="butt" onClick={handleClick}>Go</button> 
            </div>
           
        </div>
    )
}

const StyledInput = injectSheet(styles)(Input)

function Comp({classes}){

    const [state, setState] = useState(true);

    const collChange = (args) => {
        setState({
            ...state, 
            ...args, 
        });
    }

    return (
        <div style={{margin: 0}}>
            <div className={classes.top} > 
                <h1>We Weather</h1>
            </div>
            <button onClick={() => collChange({open: !state.open})}> Collapse </button>
            { !state.open && <StyledInput style={{margin: "10px"}}/> }
            
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