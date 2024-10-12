import React, { useState } from 'react'
import './Calculator.css'
import './media.css'

const Calculator = () => {

    const [data, setData] = useState("")
    
    const handleClick = (val) => {
        // Prevent multiple operators at the same time
        if (/[+\-*/.]/.test(val) && /[+\-*/.]$/.test(data)) {
            return;
        }
        // Prevent operators as the first character except '-'
        if (data === "" && /[+*/.]/.test(val)) {
            return;
        }
        if (data === "Error") {
            clear()
        }

        setData((prev) => prev + val)
    }

    const clear = () => {
        setData("")
    }

    const cut = () => {
        // Delete the last character of the current input
        setData((prev)=> prev.slice(0, -1))
    }

    const calculate = () => {
        if (data === "Error") {
            clear();
            return;
        }
        try {
            const res = solve(data);
            // set the result to the display
            setData(res.toString())
        } catch {
            setData("Error")
        }
    }

    const solve = (input) => {
        if (input === "") {
            return "";
        }

        // Break the input string into numbers and operators
        let arr = input.match(/\d+\.?\d*|[+\-*/%]/g)

        let result;

        if (input[0] === '-') {
            result = -parseFloat(arr[1]);      // first number is negative 
            arr = arr.slice(2);                // Remove the negative sign and number from the array
        } else {
            result = parseFloat(arr[0]);       // First number is positive
            arr = arr.slice(1);                // Remove the number from the array
        }
        
        // loop through the rest of the array
        for (let i = 0; i < arr.length; i += 2) {   

            let operator = arr[i];
            let operand = parseFloat(arr[i + 1])

            if (isNaN(operand)) {
                throw new Error("Invalid input")
            }
            if (operator === "+") {
                result = result + operand;
            }
            else if (operator === "-") {
                result = result - operand;
            }
            else if (operator === "*") {
                result = result * operand;
            }
            else if (operator === "/") {
                if (operand === 0) {
                    throw new Error("Cannot divide by zero")
                } else {
                    result = result / operand;
                }
            } else if (operator === "%") {
                result = (result * operand) / 100;
            }
        }
        return result
    }

  return (
    <div className='cal'>
          <input type="text" value={data} readOnly />
          <div className='btn'>
              <button className='special' onClick={clear}>C</button>
              <button className='special' onClick={cut}>←</button>
              {/* Map over an array of buttons to generate the layout */}
              {["%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", ".", "0"].map((btn, index) => {
                  return (
                      <button key={index} onClick={() => handleClick(btn)}>{ btn }</button>
                  )
              })}
              
              <button onClick={calculate}>=</button>
          </div>
    </div>
  )
}

export default Calculator