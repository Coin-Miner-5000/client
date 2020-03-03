import React, { useState } from 'react';
import { axiosWithAuth } from './utils/axiosWithAuth';

function SellTreasure({ setCooldown, roomId }) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleChange = (e) => setInput(e.target.value);

  const fetchTreasureData = (obj, confirm = true) => {
    if (roomId !== 1) {
      setErrors(['You must be in the shop to do that shit!']);
      return;
    }
    axiosWithAuth()
      .post('https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/', obj)
      .then((res) => {
        setCooldown(res.data.cooldown);
        if (!!res.data.errors.length) {
          setMessages([]);
          setErrors(res.data.errors);
        }

        if (!!res.data.messages.length) {
          setErrors([]);
          if (confirm === true) {
            setMessages(res.data.messages);
          } else {
            setMessages([res.data.messages[0]]);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getTreasureValue = () => fetchTreasureData({ name: input }, false);

  const sellTreasure = () => fetchTreasureData({ name: input, confirm: 'yes' });
  console.log(roomId);
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '30px',
        }}
      >
        <input onChange={handleChange} />
        <button onClick={() => getTreasureValue()}>Get Value</button>
        <button onClick={() => sellTreasure()}>Sell treasure</button>
      </div>

      <div>
        {!!errors.length && // setting key to index since order doesn't matter
          errors.map((error, index) => <li key={index}>{error}</li>)}
        {/* {messages && messages} */}
        {!!messages.length &&
          messages.map((message, index) => <li key={index}>{message}</li>)}
      </div>
    </>
  );
}

export default SellTreasure;
