import React, { createContext, useState } from "react";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [text, setText] = useState("");
  const [qty, setQty] = useState(0);
  const [shares, setShares] = useState(null);
  const [load, setLoading] = useState(false);
  const [al, setal] = useState(false);
  const [port, setport] = useState(false);
  const [profit, setProfit] = useState(0);
  const [profitnow, setProfitnow] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [chart, setChart] = useState(null);
  const [update, setupdate] = useState(false);
  return (
    <MyContext.Provider
      value={{
        data,
        setData,
        chartData,
        chart,
        setChart,
        setChartData,
        text,
        setText,
        load,
        shares,
        qty,
        setQty,
        port,
        profit,
        profitnow,
        setProfitnow,
        setProfit,
        update,
        setupdate,
        setport,
        setShares,
        setLoading,
        al,
        setal,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
