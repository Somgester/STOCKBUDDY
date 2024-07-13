import { useContext } from "react";
import { React, useState } from "react";
import { MyContext } from "./context";
const Stocks = () => {
  const { load, shares, setport, setShares } = useContext(MyContext);
  const [disabled, setDisabled] = useState(false);
  const sell = async (index, profit) => {
    setDisabled(true);
    const res = await fetch(
      `http://localhost:5000/api/sell?symbol=${index}&profit=${profit}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const updatedshares = shares.filter((_, i) => shares[i].symbol !== index);
    // console.log(updatedshares);
    localStorage.setItem("shares", JSON.stringify(updatedshares));
    setShares(updatedshares);
    setDisabled(false);

    // console.log(res.json());
  };
  const portchange = () => {
    setport(false);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "rgb(150, 255, 150)",
          width: "100vw",
          position: "relative",
          zIndex: "0",
          // margin: "10px 0 0 0",
        }}
      >
        <h2
          style={{
            // marginTop: "40px",
            // marginBottom: "40px",
            backgroundColor: "rgb(90, 255, 90)",
            fontSize: "35px",
            width: "300px",
            marginTop: 20,
          }}
        >
          MY SHARES
        </h2>
        <button
          className="button-52 hb"
          onClick={portchange}
          style={{ margin: "10px 0 0 0" }}
        >
          Search
        </button>
      </div>
      <div class="login-box">
        {!shares && <h1>Loading..</h1>}

        {shares !== null && (
          <>
            {!shares && <h1>No Shares</h1>}
            <div className="shares-container">
              {shares.map((share, index) => (
                <div
                  className="share"
                  key={index}
                  style={{
                    backgroundColor:
                      share.profit[0] > 0
                        ? "rgba(145, 228, 107, 0.7)"
                        : "rgba(243, 136, 136, 0.7)",
                  }}
                >
                  <h1 style={{ color: share.profit[0] > 0 ? "green" : "red" }}>
                    {share.symbol}
                  </h1>
                  <div style={{ height: "50px" }}>
                    <div>
                      <span>
                        Change :{" "}
                        {(
                          ((share.profit[1] - share.price) / share.price) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                      <span>Bought at: {share.price.toFixed(2)}</span>
                      <span>Curr: {share.profit[1]}</span>
                    </div>
                    <div>
                      <span>Qty: {share.quantity}</span>
                      <span>Profit: {share.profit[0]}</span>
                    </div>
                  </div>
                  <button
                    className="button-52 hll"
                    onClick={() =>
                      sell(share.symbol, parseInt(share.profit[0]))
                    }
                    style={{
                      disabled: disabled,
                      position: "relative",
                      top: "100px",
                    }}
                  >
                    Sell
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stocks;
