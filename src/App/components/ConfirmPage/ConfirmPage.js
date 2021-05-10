import React, { useState } from "react";
import PropTypes from "prop-types";

import "./ConfirmPage.scss";

import { API_BASE_URL } from "../../constants/apiConstants";
import { LOADER_SVG } from "../../constants/svgConstants";

const getValueTitle = (value) => {
  if (!("" + value).includes(".")) return `${value}.00`;

  const [whole, fractional] = ("" + value).split(".");
  return `${whole}.${(fractional + "00").slice(0, 2)}`;
};

function ConfirmPage({
  activeInvoiceMethod,
  activeWithdrawMethod,
  invoiceValue,
  withdrawValue,
  resetData,
  setActivePage,
}) {
  const [isLoad, setIsLoad] = useState(false);
  const onConfirmClick = () => {
    setIsLoad(true);
    fetch(`${API_BASE_URL}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: invoiceValue,
        base: "invoice",
        invoicePayMethod: activeInvoiceMethod.id,
        withdrawPayMethod: activeWithdrawMethod.id,
      }),
    })
      .then((data) => data.json())
      .then(({ message }) => {
        setIsLoad(false);
        // Если статус успешный переходим на страницу успешной заявки
        if (message === "Success") {
          setActivePage(3);
          resetData();
        }
      })
      .catch((e) => {
        setIsLoad(false);
      });
  };

  const infoItems = [
    {
      title: "Sell",
      description: `${getValueTitle(invoiceValue)} ${
        activeInvoiceMethod.name || ""
      }`,
    },
    {
      title: "Buy",
      description: `${getValueTitle(withdrawValue)} ${
        activeWithdrawMethod.name || ""
      }`,
    },
  ];

  return (
    <div className="exchange__block details-page">
      {isLoad && <div className="currency-exchange__opacity-block"></div>}
      <h3 className="exchange__title details-page__title">Details</h3>

      <div className="details-page__info-block">
        {infoItems.map(({ title, description }) => (
          <div key={title} className="details-page__info-item">
            <p className="details-page__info-title">{title}</p>
            <p className="details-page__info-description">{description}</p>
          </div>
        ))}
      </div>

      <div className="details-page__buttons-block">
        <button
          onClick={() => {
            setActivePage(1);
          }}
          className="exchange__second-button details-page__button"
        >
          Cencel
        </button>
        <button
          onClick={onConfirmClick}
          className="exchange__main-button details-page__button"
        >
          {isLoad ? (
            <span className="exchange__loader-animation">{LOADER_SVG}</span>
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );
}

ConfirmPage.propTypes = {
  activeInvoiceMethod: PropTypes.object,
  activeWithdrawMethod: PropTypes.object,
  invoiceValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  withdrawValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  resetData: PropTypes.func,
  setActivePage: PropTypes.func,
};

ConfirmPage.defaultProps = {
  activeInvoiceMethodName: "",
  activeWithdrawMethodName: "",
  invoiceValue: "",
  withdrawValue: "",
  resetData: () => {},
  setActivePage: () => {},
};

export default ConfirmPage;
