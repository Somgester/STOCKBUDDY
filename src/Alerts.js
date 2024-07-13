import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { MyContext } from "./context";
const IndexRatios = () => {
  const { chart, setChart } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (!chart) {
        try {
          const response = await fetch(
            "https://api.moneycontrol.com/mcapi/v1/fys/api/v1/stockfeeds/page?alerts=PRICE_ALERT%2CNEWS%2CANNOUNCEMENT%2CCORPORATE_ACTION%2CRESULT%2CTECHNICAL_ANALYSIS%2CDERIVATIVES%2CDEAL%2CSHAREHOLDING%2CRESEARCH&forward=true&index=7&list=MCCURATED&size=10"
          );
          const data = await response.json();
          console.log("fetchhhhhhhhh");
          const chart = data.data.list; // Adjusted to new data structure
          setChart(chart);
          setLoading(false);
        } catch (error) {
          alert("Error fetching Alerts");
          setLoading(true);
        }
      } else {
        setChart(chart);
        setLoading(false);
      }
    };

    fetchData();
    setLoading(false);
  }, []);

  const openModal = (stock) => {
    setSelectedStock(stock);
  };

  const closeModal = () => {
    setSelectedStock(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  } else
    return (
      <div>
        <h1>Alerts!</h1>
        <div className="alerts">
          {Array.isArray(chart) &&
            chart.length > 0 &&
            chart
              .sort(
                (a, b) =>
                  parseFloat(b.percentchange) - parseFloat(a.percentchange)
              )
              .map((stock) => (
                <div
                  key={stock.scId}
                  style={{
                    margin: "10px",
                    padding: "10px",
                    border: "1px solid black",
                    cursor: "pointer",
                    backgroundColor:
                      stock.percentchange > 0 ? "lightgreen" : "red",
                  }}
                  onClick={() => openModal(stock)}
                >
                  <h2>{stock.fullName || stock.shortName}</h2>
                  <p>Price: {stock.price}</p>
                  <p>Change: {stock.change}</p>
                  <p>Percent Change: {stock.percentchange}%</p>
                  <p>Exchange: {stock.exchg}</p>
                  <p>Followers: {stock.followerCount}</p>
                  <a
                    href={stock.pncUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    More Info
                  </a>
                </div>
              ))}
        </div>

        {selectedStock && (
          <Modal
            isOpen={!!selectedStock}
            onRequestClose={closeModal}
            contentLabel="Stock Details"
            ariaHideApp={false}
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "400px",
                maxHeight: "80vh",
                overflowY: "auto",
                backgroundColor:
                  selectedStock.percentchange > 0
                    ? "lightgreen"
                    : "rgb(235, 124, 124)",
              },
            }}
          >
            <h2>{selectedStock.fullName || selectedStock.shortName}</h2>
            <p>Price: {selectedStock.price}</p>
            <p>Change: {selectedStock.change}</p>
            <p>Percent Change: {selectedStock.percentchange}%</p>
            <p>Exchange: {selectedStock.exchg}</p>
            <p>Followers: {selectedStock.followerCount}</p>
            <a
              href={selectedStock.pncUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              More Info
            </a>

            {selectedStock.feeds && (
              <div>
                <h3>Feeds:</h3>
                {Object.entries(selectedStock.feeds).map(
                  ([feedType, feedData]) => (
                    <div key={feedType}>
                      <h4>{feedType}</h4>
                      {Array.isArray(feedData) &&
                        feedData.map((feed, index) => (
                          <div key={index}>
                            <h5>{feed.subCategory}</h5>
                            {feed.data &&
                              Array.isArray(feed.data.dataList) &&
                              feed.data.dataList.map((item, idx) => (
                                <div key={idx}>
                                  {Object.entries(item).map(
                                    ([key, value]) =>
                                      (key == "action" ||
                                        key == "fullName") && (
                                        <p key={key}>
                                          <strong>{key}</strong>: {value}
                                        </p>
                                      )
                                  )}
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  )
                )}
              </div>
            )}
            <button onClick={closeModal}>Close</button>
          </Modal>
        )}
      </div>
    );
};

export default IndexRatios;
