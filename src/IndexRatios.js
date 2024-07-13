import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "./context";
const IndexRatios = () => {
  const { chartData, setChartData } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const fetchdata = async () => {
    setLoading(true);
    if (!chartData) {
      try {
        const data = await fetch(
          "https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=1D&sector=&type=MM&sectorSelected=false",
          {
            method: "GET",
          }
        );
        const chari = await data.json();
        console.log(chari.data.chartData);
        setChartData(chari.data.chartData);
        setLoading(false);
      } catch (err) {
        alert("Indexratios", err);
      }
    } else setLoading(false);
    // console.log(chartData);
  };
  useEffect(() => {
    fetchdata();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!loading) {
    const renderTable = (length) => {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="stt">
            {chartData
              .filter((stock) => Object.keys(stock).length === length)
              .sort((a, b) => (b.changeP || 0) - (a.changeP || 0))
              .map((stock) => (
                <div key={stock.id}>
                  {length === 13 && (
                    <div
                      style={{
                        fontSize: 20,
                        backgroundColor: `${stock.color}`,
                        width: "300px",
                        textAlign: "center",
                        height: "325px",
                      }}
                    >
                      {length === 13 && stock.fullName && (
                        <h3>{stock.fullName}</h3>
                      )}

                      <ul>ltp : {stock.ltp || "-"}</ul>
                      <ul>
                        change : {stock.change ? stock.change.toFixed(2) : "-"}
                      </ul>
                      <ul>
                        changeP :
                        {stock.changeP ? stock.changeP.toFixed(2) + "%" : "-"}
                      </ul>
                      <ul>sector : {stock.sector || "-"}</ul>
                      <ul>
                        mrkCap : {stock.mrkCap ? stock.mrkCap.toFixed(2) : "-"}
                      </ul>
                      <ul>
                        url:
                        {stock.url && (
                          <a
                            href={stock.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            More Info
                          </a>
                        )}
                      </ul>
                    </div>
                  )}
                  {length === 4 && (
                    <div
                      style={{
                        fontSize: 20,
                        backgroundColor: `lightgrey`,
                        width: "300px",
                        alignItems: "center",
                        textAlign: "center",
                        height: "100px",
                      }}
                    >
                      <div>
                        {length === 4 && stock.name && <div>{stock.name}</div>}
                      </div>
                      <div>{stock.totalStocks}</div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      );
    };

    return (
      <div>
        {chartData && (
          <>
            <h1>Index Ratios</h1>
            <h2>length 13</h2>
          </>
        )}
        {renderTable(13)}
        {chartData && <h2>length 4</h2>}
        {renderTable(4)}
      </div>
    );
  }
};

export default IndexRatios;
