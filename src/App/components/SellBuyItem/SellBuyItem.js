import React from "react";
import PropTypes from "prop-types";
import { LOADER_SVG } from "../../constants/svgConstants";
import DropBlock from "../DropBlock/DropBlock";

import "./SellBuyItem.scss";

function SellBuyItem({
  items,
  activeMethod,
  onItemClick,
  title,
  onInputChange,
  inputValue,
  isLoad,
  inputName,
}) {
  return (
    <div className="sellbuy-item">
      <h3 className="exchange__title sellbuy-item__title">{title}</h3>

      <DropBlock
        items={items}
        activeItem={activeMethod}
        onItemClick={onItemClick}
      />

      <div className="sellbuy-item__input-block">
        <input
          type="number"
          name={inputName}
          className="sellbuy-item__money-input"
          placeholder="00.00"
          onChange={onInputChange}
          value={inputValue}
        />
        {isLoad && (
          <span className="currency-exchange__loader-wrapper">
            {LOADER_SVG}
          </span>
        )}
      </div>
    </div>
  );
}

SellBuyItem.propTypes = {
  title: PropTypes.string,
  inputName: PropTypes.string,
  inputValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoad: PropTypes.bool,
  activeMethod: PropTypes.object,
  items: PropTypes.array,
  onInputChange: PropTypes.func,
  onItemClick: PropTypes.func,
};

SellBuyItem.defaultProps = {
  title: "",
  inputName: "",
  inputValue: "",
  isLoad: false,
  activeMethod: {},
  items: [],
  onInputChange: () => {},
  onItemClick: () => {},
};

export default SellBuyItem;
