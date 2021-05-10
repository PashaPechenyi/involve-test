import React from "react";

import { SUCCESS_SVG } from "../../constants/svgConstants";

import "./SuccessPage.scss";

function SuccessPage({ setActivePage }) {
  return (
    <div className="exchange__block success-page">
      <div className="success-page__img-block">{SUCCESS_SVG}</div>

      <h3 className="success-page__title">Success!</h3>
      <p className="success-page__description">
        Your exchange order has been placed successfully and will be processed
        soon.
      </p>

      <button
        onClick={() => {
          setActivePage(1);
        }}
        className="exchange__main-button"
      >
        Home
      </button>
    </div>
  );
}

export default SuccessPage;
