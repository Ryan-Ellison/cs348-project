import React, { useState, useEffect } from 'react';
import './styling.css'

export function DisplayData() {
    const [sets, setSets] = useState([]);

    const fetchSets = async () => {
        fetch('/getSets', {playerName:'Bread'}).then(res => res.json()).then(data => {
            console.log(data)
        })
      };

    useEffect(() => {
        //fetchSets()
    })

    function deleteSet(setId) {
        let data = new FormData()
        data.append("setId", setId)
        fetch('/deleteSet', {
            method: 'delete',
            body: data
        })
        .then(res => res.json())
        .then(data => {
            getSetsSubmit(null)
        })
    }

    function incrementWins(setId, playerUsername) {
        let data = new FormData()
        data.append("setId", setId)
        data.append("playerUsername", playerUsername)
        fetch('/incrementWins', {
            method: 'post',
            body: data
        })
        .then(res => res.json())
        .then(data => {
            getSetsSubmit(null)
        })
    }

    function decrementWins(setId, playerUsername) {
        let data = new FormData()
        data.append("setId", setId)
        data.append("playerUsername", playerUsername)
        fetch('/decrementWins', {
            method: 'post',
            body: data
        })
        .then(res => res.json())
        .then(data => {
            getSetsSubmit(null)
        })
    }

    const getSetsSubmit = (e) => {
        if (e != null) {
            e.preventDefault()
            console.log("clicked")
        }
        console.log(document.getElementById("playerName").value)
        let data = new FormData()
        data.append("playerName", document.getElementById("playerName").value)
        fetch('/getSets', {
            method: 'post',
            body: data
        })
        .then(res => res.json())
        .then(data => {
            const results = data.result
            console.log(results)
            const displaySets = results.map((item, index) => {
                return (<div key={item.setId}>
                    <label>{item.player1Username}  Vs.  {item.player2Username}  -  {item.datePlayed}</label><br/>
                    <button onClick={() => incrementWins(item.setId, item.player1Username)}>+</button>
                    <button onClick={() => decrementWins(item.setId, item.player1Username)}>-</button>
                    <label>{item.player1Wins}  -  {item.player2Wins}</label>
                    <button onClick={() => incrementWins(item.setId, item.player2Username)}>+</button>
                    <button onClick={() => decrementWins(item.setId, item.player2Username)}>-</button><br/>
                    <button onClick={() => deleteSet(item.setId)}>Delete this set</button>
                </div>)
            })
            console.log(displaySets)
            setSets(displaySets)
        })
        .catch(function(error) {
            console.log("error: " + error)
        })
    }


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
            <div className="column">
                <iframe name="blank" style={{display:"none"}}></iframe>
                <form target="blank" onSubmit={getSetsSubmit} action="/getSets" method="post">
                    <label>View Player's Set:</label><br/>
                    <label for="playerName">Player Username:</label><br/>
                    <input type="text" id="playerName" name="playerName" required/><br/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
            <div className="column">
                <label>Sets</label>
                {sets}
            </div>
        </div>
    );
}

export default DisplayData