import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { API_BASE_URL } from "../../constants/apiConstants";

import SellBuyItem from "../SellBuyItem/SellBuyItem";

import "./ExchangePage.scss";
import { LOADER_SVG } from "../../constants/svgConstants";
import usePrevious from "../../hooks/usePrevious";

function ExchangePage({
  activeInvoiceMethod,
  activeWithdrawMethod,
  invoiceValue,
  withdrawValue,
  setActiveInvoiceMethod,
  setActiveWithdrawMethod,
  setInvoiceValue,
  setWithdrawValue,
  setActivePage,
}) {
  const [payMethods, setPayMethods] = useState({ invoice: [], withdraw: [] });
  useEffect(() => {
    fetch(`${API_BASE_URL}/payMethods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setPayMethods(data);
        return data;
      });
  }, []);

  // меняем выбраную валюту при нажатии ел в dropdown
  const onInvoiceClick = (item) => {
    // Если выбраная валюта такая же как в блоке buy
    // меняем их местами
    if (item.id === activeWithdrawMethod.id) {
      setActiveWithdrawMethod(activeInvoiceMethod);
      setActiveInvoiceMethod(item);
      return;
    }

    setActiveInvoiceMethod(item);
  };
  const onWithdrawClick = (item) => {
    // Если выбраная валюта такая же как в блоке sell
    // меняем их местами
    if (item.id === activeInvoiceMethod.id) {
      setActiveInvoiceMethod(activeWithdrawMethod);
      setActiveWithdrawMethod(item);
      return;
    }

    setActiveWithdrawMethod(item);
  };

  // Идет ли загрузка данных о пересчете курса
  const [isInvoiceLoad, setIsInvoiceLoad] = useState(false);
  const [isWithdrawLoad, setIsWithdrawLoad] = useState(false);

  // Поле для сравнения предыдущего результата запроса
  // (чтобы не создавался новый запрос после обновления количества валюты)
  const [lastRequestChanges, setLastRequestChanges] = useState({});
  // Меняем поля курса валюты при изменении количества валюты
  const onInputChange = ({ target: { value, name } }) => {
    if (name === "invoice") {
      setInvoiceValue(value);
    } else if (name === "withdraw") {
      setWithdrawValue(value);
    }
  };

  const previousState = usePrevious({
    activeInvoiceMethodId: activeInvoiceMethod.id,
    activeWithdrawMethodId: activeWithdrawMethod.id,
    invoiceValue,
    withdrawValue,
  });
  // Пересчитываем курс валюты при изменении типа валюты
  useEffect(() => {
    if (
      !previousState ||
      !activeInvoiceMethod.id ||
      !activeWithdrawMethod.id ||
      (!invoiceValue && !withdrawValue)
    )
      return;

    let base = "invoice";
    //  Если поле SELL пустое а BUY нет то просчитываем поле SELL
    if (!invoiceValue) base = "withdraw";
    // Если значение курса в поле изменилось после запроса новый запрос не делаем
    if (withdrawValue !== previousState.withdrawValue) {
      // Если изменилось значение withdrawValue
      if (!withdrawValue) {
        setInvoiceValue("");
        return;
      }

      if (
        lastRequestChanges.type === "invoice" &&
        withdrawValue === lastRequestChanges.value
      )
        return;

      base = "withdraw";
    } else if (invoiceValue !== previousState.invoiceValue) {
      // Если изменилось значение invoiceValue
      if (!invoiceValue) {
        setWithdrawValue("");
        return;
      }

      if (
        lastRequestChanges.type === "withdraw" &&
        invoiceValue === lastRequestChanges.value
      ) {
        return;
      }
    }

    const onLoadFunc =
      base === "invoice" ? setIsWithdrawLoad : setIsInvoiceLoad;
    const setAmountFunc =
      base === "invoice" ? setWithdrawValue : setInvoiceValue;
    const params = {
      base,
      amount: base === "invoice" ? +invoiceValue : +withdrawValue,
      invoicePayMethod: activeInvoiceMethod.id,
      withdrawPayMethod: activeWithdrawMethod.id,
    };

    let url = new URL(`${API_BASE_URL}/payMethods/calculate`);
    url.search = new URLSearchParams(params).toString();

    onLoadFunc(true);

    let controller = new AbortController();
    fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(({ amount }) => {
        onLoadFunc(false);
        setLastRequestChanges({ type: base, value: amount });
        setAmountFunc(amount);
      })
      .catch((e) => {
        console.log(e);
      });

    // обрываем запрос
    return () => {
      onLoadFunc(false);
      controller.abort();
    };
  }, [
    activeInvoiceMethod.id,
    activeWithdrawMethod.id,
    invoiceValue,
    withdrawValue,
  ]);

  const buttonFunc = () => {
    if (
      !activeInvoiceMethod.id ||
      !activeWithdrawMethod.id ||
      (!invoiceValue && !withdrawValue)
    )
      return;

    setActivePage(2);
  };

  const sellbuyItems = [
    {
      inputName: "invoice",
      items: payMethods.invoice,
      activeMethod: activeInvoiceMethod,
      onItemClick: onInvoiceClick,
      title: "Sell",
      inputValue: invoiceValue,
      isLoad: isInvoiceLoad,
    },
    {
      inputName: "withdraw",
      items: payMethods.withdraw,
      activeMethod: activeWithdrawMethod,
      onItemClick: onWithdrawClick,
      title: "Buy",
      inputValue: withdrawValue,
      isLoad: isWithdrawLoad,
    },
  ];

  const showOpacityBlock = useMemo(
    () => !!(!payMethods.invoice.length && !payMethods.withdraw.length),
    [payMethods]
  );

  return (
    <div className="exchange__block currency-exchange">
      {showOpacityBlock && (
        <div className="currency-exchange__opacity-block"></div>
      )}

      <div className="currency-exchange__sellbuy-wrapper">
        {sellbuyItems.map((args) => (
          <SellBuyItem
            key={args.inputName}
            {...args}
            onInputChange={onInputChange}
          />
        ))}
      </div>

      <div className="currency-exchange__button-block">
        <button onClick={buttonFunc} className="exchange__main-button">
          {showOpacityBlock ? (
            <span className="exchange__loader-animation">{LOADER_SVG}</span>
          ) : (
            "Exchange"
          )}
        </button>
      </div>
    </div>
  );
}

ExchangePage.propTypes = {
  activeInvoiceMethod: PropTypes.object,
  activeWithdrawMethod: PropTypes.object,
  invoiceValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withdrawValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setActiveInvoiceMethod: PropTypes.func,
  setActiveWithdrawMethod: PropTypes.func,
  setInvoiceValue: PropTypes.func,
  setWithdrawValue: PropTypes.func,
  setActivePage: PropTypes.func,
};

ExchangePage.defaultProps = {
  activeInvoiceMethod: {},
  activeWithdrawMethod: {},
  invoiceValue: "",
  withdrawValue: "",
  setActiveInvoiceMethod: () => {},
  setActiveWithdrawMethod: () => {},
  setInvoiceValue: () => {},
  setWithdrawValue: () => {},
  setActivePage: () => {},
};

export default ExchangePage;
