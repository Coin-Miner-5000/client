import React, { useState, useEffect } from "react";
import "./App.css";
import { axiosWithAuth } from "./components/utils/axiosWithAuth";

function App() {
  const [data, setData] = useState({});
  const jsonCode = JSON.stringify(data, null, 4);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    axiosWithAuth()
      .get("https://lambda-treasure-hunt.herokuapp.com/api/adv/init/")
      .then(res => {
        // console.log(res);
        setData(res.data);
        setCooldown(res.data.cooldown);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    function timer() {
      setCooldown(cooldown - 1);
    }
    setTimeout(timer, 1000);
  }, [cooldown]);

  const move = direction => {
    axiosWithAuth()
      .post("https://lambda-treasure-hunt.herokuapp.com/api/adv/move/", {
        direction
      })
      .then(res => {
        console.log(res);
        setData(res.data);
        setCooldown(res.data.cooldown);
      })
      .catch(err => {
        console.log(err.response);
        setCooldown(Math.ceil(err.response.data.cooldown));
      });
  };

  return (
    <div className="App">
      <div>
        <p>Cooldown</p>
        <p>{cooldown}</p>
      </div>
      <div className="terminal">
        <pre>{jsonCode}</pre>
      </div>

      <div>
        <p>Controls</p>
        <button onClick={() => move("n")}>N</button>
        <button onClick={() => move("w")}>W</button>
        <button onClick={() => move("e")}>E</button>
        <button onClick={() => move("s")}>S</button>
      </div>
    </div>
  );
}

export default App;
