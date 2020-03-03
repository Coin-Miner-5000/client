import React, { useState } from "react";
import { axiosWithAuth } from "./utils/axiosWithAuth";

function Inventory({ setCooldown }) {
  const [user, setUser] = useState({});
  const [inventory, setInventory] = useState([]);

  const getInventory = e => {
    e.preventDefault();
    axiosWithAuth()
      .post("https://lambda-treasure-hunt.herokuapp.com/api/adv/status/")
      .then(res => {
        console.log(res);
        setUser(res.data);
        setInventory(res.data.inventory);
        setCooldown(res.data.cooldown);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <button onClick={e => getInventory(e)} style={{ margin: "30px" }}>
        View Inventory
      </button>
      <div>
        <p>{user.name}</p>
        {inventory.map(item => {
          return <p key={item}>{item}</p>;
        })}
      </div>
    </div>
  );
}

export default Inventory;
