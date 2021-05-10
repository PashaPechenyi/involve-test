import React, { useCallback, useState } from "react";

import ExchangePage from "./components/ExchangePage/ExchangePage";
// import TimeBlock from "./components/TimeBlock";

import "./App.scss";
import ConfirmPage from "./components/ConfirmPage/ConfirmPage";
import SuccessPage from "./components/SuccessPage/SuccessPage";

const App = () => {
  const [activePage, setActivePage] = useState(1);

  // выбранная валюта
  const [activeInvoiceMethod, setActiveInvoiceMethod] = useState({});
  const [activeWithdrawMethod, setActiveWithdrawMethod] = useState({});

  // Значения валют в input
  const [invoiceValue, setInvoiceValue] = useState("");
  const [withdrawValue, setWithdrawValue] = useState("");

  const resetData = useCallback(() => {
    setActiveInvoiceMethod({});
    setActiveWithdrawMethod({});
    setInvoiceValue("");
    setWithdrawValue("");
  }, []);
  return (
    <div className="exchange">
      {activePage === 1 && (
        <ExchangePage
          activeInvoiceMethod={activeInvoiceMethod}
          activeWithdrawMethod={activeWithdrawMethod}
          invoiceValue={invoiceValue}
          withdrawValue={withdrawValue}
          setActiveInvoiceMethod={setActiveInvoiceMethod}
          setActiveWithdrawMethod={setActiveWithdrawMethod}
          setInvoiceValue={setInvoiceValue}
          setWithdrawValue={setWithdrawValue}
          setActivePage={setActivePage}
        />
      )}

      {activePage === 2 && (
        <ConfirmPage
          activeInvoiceMethod={activeInvoiceMethod}
          activeWithdrawMethod={activeWithdrawMethod}
          invoiceValue={invoiceValue}
          withdrawValue={withdrawValue}
          resetData={resetData}
          setActivePage={setActivePage}
        />
      )}

      {activePage === 3 && <SuccessPage setActivePage={setActivePage} />}
    </div>
  );
};

export default App;
