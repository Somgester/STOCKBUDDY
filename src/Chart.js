import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const ChartComponent = () => {
  const [chartData, setChartData] = useState([{ time: "", price: 0 }]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/old-data");
      const data = await response.json();
      const candles = data.candles;
      const combinedEntries = [
        ...candles.slice(Math.max(candles.length - 30, 0), candles.length),
      ];

      const newChartData = combinedEntries.map((entry) => ({
        time: new Date(entry[0] * 1000).toLocaleTimeString(),
        price: entry[1],
      }));

      setChartData(newChartData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchDataLive = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/live");
      const data = await response.json();
      const lastCandle = data;

      const newEntry = {
        time: new Date(lastCandle[0] * 1000).toLocaleTimeString(),
        price: 1628,
      };
      setChartData((prevData) => {
        const updatedData = [...prevData, newEntry];
        if (updatedData.length > 30) {
          updatedData.shift(); // Remove the oldest entry to keep only the last 30
        }
        return updatedData;
      });
      console.log("New entry:", chartData);
    } catch (error) {
      console.error("Error fetching live data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch live data every minute
    const interval = setInterval(() => {
      fetchDataLive();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const data = {
    labels: chartData.map((item) => item.time),
    datasets: [
      {
        label: "Price",
        data: chartData.map((item) => item.price),
        borderColor:
          chartData[chartData.length - 1].price >=
          chartData[chartData.length - 2].price
            ? "lightgreen"
            : "red",
        borderWidth: 1.7,
        pointRadius: 8,
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

export default ChartComponent;
