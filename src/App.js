import "./App.css";
import { useEffect, useContext, useState } from "react";
import Search from "./search";
import { MyContext } from "./context";
import Stocks from "./Stocks";
import { fetchShares, fetchprof } from "./functions";
import IndexRatios from "./IndexRatios";
import Alerts from "./Alerts";
import ChartComponent from "./Chart";
function App() {
  const {
    port,
    profit,
    setProfit,
    setLoading,
    shares,
    setShares,
    load,
    profitnow,
    setProfitnow,
  } = useContext(MyContext);
  const [tops, settops] = useState(false);
  const [alerts, setalerts] = useState(false);
  const [graph, setgraphs] = useState(false);
  const [model, setmodel] = useState(false);
  const [pred, setpred] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const share = localStorage.getItem("shares")
        ? JSON.parse(localStorage.getItem("shares"))
        : "a";
      const sh = localStorage.getItem("prof")
        ? JSON.parse(localStorage.getItem("prof"))
        : "a";
      setProfit(sh);
      if (share === "a" || sh === "a") {
        const res = await fetchShares(
          setShares,
          setLoading,
          shares,
          setProfitnow,
          setProfit
        );
        console.log(sh);
        const rep = JSON.parse(res);
        setShares(rep); // Update shares state with fetched data
        localStorage.setItem("shares", JSON.stringify(rep)); // Store shares in localStorage
        localStorage.setItem("prof", JSON.stringify(sh));
        setProfit(sh);
        fetchprof(setProfit, setShares, setProfitnow, rep); // Fetch profit data
        setLoading(false); // Set loading to false after fetching data
      } else {
        const shar = JSON.parse(localStorage.getItem("shares"));
        fetchprof(setProfit, setShares, setProfitnow, shar); // Fetch profit data using current shares state
      }
    };

    fetchData(); // Initial fetch on component mount

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 10 seconds
    }, 15000);

    return () => {
      clearInterval(interval); // Clean up interval on component unmount
    };
  }, [setLoading]); // Dependency array ensures this effect runs whenever `shares` changes
  const fetchmod = async () => {
    const modout = fetch("http://localhost:5000/api/model", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const mod = await modout;
    const modres = await mod.json();
    console.log(modres["ans"]);
    setpred("hello");
  };
  // useEffect(() => {
  //   // Socket.IO connection
  //   const socket = socketIOClient("http://localhost:5000/api/searching");
  //   socket.on("data_response", (newData) => {
  //     console.log(newData);
  //     // setProfitnow(newData);
  //   });

  //   return () => socket.disconnect();
  // }, []);

  return (
    <div
      className="App"
      style={{
        backgroundColor:
          profit > 0 ? "rgba(145, 228, 107, 0.7)" : "rgba(243, 136, 136, 0.7)",
      }}
    >
      {!port && <Search></Search>}
      {!port && (
        <h2
          style={{
            backgroundColor:
              profit > 0
                ? "rgba(145, 228, 107, 0.7)"
                : "rgba(243, 136, 136, 0.7)",
            position: "absolute",
            top: "10%",
            marginLeft: "100px",
            fontWeight: "300",
            minWidth: "300px",
            height: "15%",
            fontFamily: "Curier New",
            fontSize: "50px",
            padding: "20px 0 20px 0",
            borderRadius: "20px",
            boxShadow: "0 15px 25px rgba(0, 0, 0, 0.6)",
          }}
        >
          Present<hr style={{ margin: "0" }}></hr>
          {profitnow > 0 ? `Profit: ${profitnow}` : `Loss: ${profitnow}`}
        </h2>
      )}
      {!port && (
        <h2
          style={{
            backgroundColor:
              profit > 0
                ? "rgba(145, 228, 107, 0.7)"
                : "rgba(243, 136, 136, 0.7)",
            position: "absolute",
            top: "10%",
            right: "100px",
            minWidth: "300px",
            height: "15%",
            fontFamily: "Curier New",
            fontSize: "50px",
            padding: "20px",
            fontWeight: "300",
            borderRadius: "20px",
            boxShadow: "0 15px 25px rgba(0, 0, 0, 0.6)",
          }}
        >
          AllTime<hr style={{ margin: "0" }}></hr>
          {profit > 0 ? `Profit: ${profit}` : `Loss: ${profit}`}
        </h2>
      )}
      {port && <Stocks></Stocks>}
      <button
        class="button-52 hb"
        onClick={() => {
          setalerts(false);
          settops((prev) => !prev);
        }}
      >
        TOPS!
      </button>
      <button
        class="button-52 hb"
        onClick={() => {
          settops(false);
          setalerts((prev) => !prev);
        }}
      >
        Alerts!
      </button>
      <button
        class="button-52 hb"
        onClick={() => {
          setgraphs((prev) => !prev);
        }}
      >
        Graph
      </button>
      <button
        class="button-52 hb"
        onClick={() => {
          fetchmod();
          setmodel((prev) => !prev);
        }}
      >
        model
      </button>
      <div className="misc-container">
        {graph && (
          <div className="chartdiv">
            <ChartComponent></ChartComponent>
          </div>
        )}
        {pred && <h2>{pred}</h2>}
        {tops && <IndexRatios></IndexRatios>}
        {alerts && <Alerts></Alerts>}
      </div>
    </div>
  );
}

export default App;
