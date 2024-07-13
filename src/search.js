import { useContext } from "react";
import React from "react";
import { MyContext } from "./context";
import { fetchShares } from "./functions";
const Search = () => {
  const {
    data,
    setData,
    text,
    setShares,
    setport,
    setQty,
    setLoading,
    load,
    setProfitnow,
    setProfit,
    setal,
    shares,
    setText,
    al,
    qty,
  } = useContext(MyContext);
  const showsportfolio = () => {
    setport(true);
  };
  const getch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/searching?symbol=${text}`
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
        console.log(response);
        setLoading(false);
      } else alert("enter valid symbol");
    } catch (err) {
      alert(err);
      setLoading(false);
    }
  };
  const qtychange = (e) => {
    setal(false);
    setQty(e.target.value);
  };
  const inputadd = (e) => {
    setText(e.target.value);
    setData(null);
  };
  const buyclick = () => {
    if (!qty) {
      setal(true);
    } else {
      try {
        fetch("http://localhost:5000/buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbol: text, price: data[0], qtx: qty }),
        })
          .then((response) => console.log(response.json()))
          .then(() =>
            fetchShares(setShares, setLoading, shares, setProfitnow, setProfit)
          )
          .then(() => {
            alert("success");
            setData(null);
          });
      } catch (err) {
        alert(err);
      }
    }
  };
  return (
    <div class="login-box2">
      <h1 className="head">STOCK BUDDY</h1>
      <div class="inputbox">
        <input
          required="required"
          type="text"
          value={text}
          onChange={inputadd}
        />
        <span>Enter Stock</span>
        <i></i>
      </div>
      <button class="button-52" onClick={getch}>
        Fetch
      </button>
      <button class="button-52 hb" onClick={showsportfolio}>
        Portfolio
      </button>

      {load && <h1>Loading..</h1>}
      {data && (
        <div class="inputbox">
          <input required="required" type="text" onChange={qtychange} />
          <span>Enter Qty</span>
          <i></i>
        </div>
      )}
      {data && <h1 className="h11">NAME:{data[1][2]}</h1>}
      {data && <h1 className="h11">OPEN : {data[1][0].toFixed(1)}</h1>}
      {data && <h1 className="h11">CURR : {data[0].toFixed(1)}</h1>}
      {data && (
        <h1 className="h11">
          DIFF. : {data && (data[0] - data[1][0]).toFixed(1)}
        </h1>
      )}

      <div>
        {data && (
          <>
            {al && <h2>Please specify Quantity!</h2>}
            <button class="button-52 hb" onClick={buyclick}>
              BUY
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
