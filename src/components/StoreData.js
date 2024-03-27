import React, { useState, useEffect } from 'react';
import './styling.css'

export function StoreData() {
  
    return (
        <div className="row">
          <div className="column">
            <iframe name="blank" style={{display:"none"}}></iframe>
            <form target="blank" action="/addSet" method="post">
                <label>Create Set:</label><br/>
                <label for="p1name">Player1 Username:</label><br/>
                <input type="text" id="p1name" name="p1name" required/><br/>
                <label for="p2name">Player2 Username:</label><br/>
                <input type="text" id="p2name" name="p2name" required/><br/>
                <label for="p1wins">Player1 Wins:</label><br/>
                <input type="number" id="p1wins" name="p1wins" max="5" min="0" required/><br/>
                <label for="p2wins">Player2 Wins:</label><br/>
                <input type="number" id="p2wins" name="p2wins" max="5" min="0" required/><br/>
                <input type="submit" value="Submit"/>
            </form>
          </div>
        </div>
    );
}

export default StoreData