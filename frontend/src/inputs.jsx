import React from 'react'
import injectSheet from 'react-jss'
import { useState, useEffect } from 'react'

const styles = () => ({    
  input: {
    left: "0", 
    borderRight: "solid black 2px", 
    borderTop: "solid black 2px", 
    width: "250px", 
    bottom: "0",
    justifyContent: "center", 
    flexDirection: "column", 
    alignText: "center"
  }, 
  close: {
    width: "50px", 
    left: "0", 
    borderRight: "solid black 2px", 
    borderTop: "solid black 2px", 
    bottom: "0",
    justifyContent: "center", 
    flexDirection: "column"
  },
  collapse: {
    position: "fixed",
    bottom: "0", 
    width: "20px", 
    height: "30px", 
    margin: "20px", 
    fontSize: "10px", 
    left: "0", 
    alignText: "center"
  }, 
  go: {
    height: '30px', 
    width: '150px', 
    margin: "10px", 
    fontSize: "10px", 
    text: "flex", 
    alignText: "center"
  }, 
  inputBox: {
    width: '200px', 
    height: '20px',
    margin: '10px', 
    align: "center", 
    float: "center"
  }
})

function Input({classes}){

    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight,
    ]);
    const [ open, setOpen ] = useState(false);  
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
    
    useEffect(() => {
    const handleWindowResize = () => {
        setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
        window.removeEventListener('resize', handleWindowResize);
    };
    }, []);

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
    }

    const handleClick = async () => {
        let values = await fetch('http://localhost:8000', {
            method: "PUT",
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(addressPackage)
        })
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch((error) => {
            console.error('Error:', error);
        }); 
        console.log(values)
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
        }
    ]

    return (
        <div  style={{height: `${windowSize[1] * .8 }px`, margin: "10px"}} >
            <button className={classes.collapse} onClick={() => setOpen(!open)}>|</button>
            {open && <div className={classes.close} style={{height: `${windowSize[1] * .8 }px`}}></div>}
            {!open && 
                <div className={classes.input} style={{height: `${windowSize[1] * .8 }px`}}> 
                    {input.map((value) => (
                        <input 
                            className={classes.inputBox} 
                            key={value.key} placeholder={value.type} 
                            value={state[value.type]} 
                            onChange={() => inputChange({[value.type]: event.target.value})} 
                        />
                    ))}
                    <button className={classes.go} onClick={handleClick} >Go</button> 
                </div>}
        </div>
    )
}

const StyledInput = injectSheet(styles)(Input)

export default StyledInput;