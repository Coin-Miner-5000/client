import React, { useState } from "react";

function TakeItem({ take, items }) {
  const [takeItem, setTakeItem] = useState("");
  //   console.log("take", takeItem);

  const handleSubmit = e => {
    e.preventDefault();
    take(e, takeItem);
    setTakeItem("");
  };
  return (
    <>
      {items.length <= 0 ? (
        <p>No items in this rooms</p>
      ) : (
        items.map(item => {
          return <p>{item}</p>;
        })
      )}
      <form>
        <input type="text" onChange={e => setTakeItem(e.target.value)} />
        <button onClick={e => handleSubmit(e)}>Take Item</button>
      </form>
    </>
  );
}

export default TakeItem;
