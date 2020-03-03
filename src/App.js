import React, { useState, useEffect } from 'react';
import './App.css';
import { axiosWithAuth } from './components/utils/axiosWithAuth';
import TakeItem from './components/TakeItem';
import Inventory from './components/Inventory';
import SellTreasure from './components/SellTreasure';

function App() {
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const jsonCode = JSON.stringify(data, null, 4);
  const [canMoveN, setCanMoveN] = useState(false);
  const [canMoveS, setCanMoveS] = useState(false);
  const [canMoveE, setCanMoveE] = useState(false);
  const [canMoveW, setCanMoveW] = useState(false);
  // console.log(canMoveN);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    axiosWithAuth()
      .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/')
      .then((res) => {
        // console.log(res);
        setData(res.data);
        setCooldown(res.data.cooldown);
        setItems(res.data.items);
        setCanMoveN(res.data.exits.includes('n'));
        setCanMoveS(res.data.exits.includes('s'));
        setCanMoveE(res.data.exits.includes('e'));
        setCanMoveW(res.data.exits.includes('w'));
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    function timer() {
      setCooldown(cooldown - 1);
    }
    setTimeout(timer, 1000);
  }, [cooldown]);

  const move = (direction) => {
    axiosWithAuth()
      .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/move/', {
        direction,
      })
      .then((res) => {
        console.log(res);
        setData(res.data);
        setCooldown(res.data.cooldown);
        setItems(res.data.items);

        setCanMoveN(res.data.exits.includes('n'));
        setCanMoveS(res.data.exits.includes('s'));
        setCanMoveE(res.data.exits.includes('e'));
        setCanMoveW(res.data.exits.includes('w'));
      })
      .catch((err) => {
        console.log(err.response);
        setCooldown(Math.ceil(err.response.data.cooldown));
      });
  };

  const take = (e, item) => {
    e.preventDefault();
    // console.log(item);
    axiosWithAuth()
      .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/take/', {
        name: item,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return data === null ? (
    <h1>Loading...</h1>
  ) : (
    <div className="App">
      <Inventory setCooldown={setCooldown} />
      <div className="terminal">
        <pre>{jsonCode}</pre>
      </div>
      <div
        style={{
          display: 'flex',
          border: '1px solid silver',
          justifyContent: 'space-between',
          padding: '20px 80px',
          margin: '40px 20px',
        }}
      >
        <div>
          <p>Cooldown</p>
          <p>{cooldown}</p>
        </div>
        <div className="controls">
          <p>Controls</p>
          <button
            onClick={() => move('n')}
            disabled={cooldown > 0 || !canMoveN}
          >
            N
          </button>
          <div>
            <button
              onClick={() => move('w')}
              disabled={cooldown > 0 || !canMoveW}
            >
              W
            </button>
            <button
              onClick={() => move('e')}
              disabled={cooldown > 0 || !canMoveE}
            >
              E
            </button>
          </div>
          <button
            onClick={() => move('s')}
            disabled={cooldown > 0 || !canMoveS}
          >
            S
          </button>
        </div>
      </div>
      <TakeItem take={take} items={items} />
      <SellTreasure setCooldown={setCooldown} roomId={data.room_id} />
    </div>
  );
}

export default App;
