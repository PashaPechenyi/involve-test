import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { DROP_ARROW_SVG } from "../../constants/svgConstants";

import "./DropBlock.scss";

function DropBlock({ items: itemsDefault, activeItem, onItemClick }) {
  const items = useMemo(
    () => itemsDefault.filter(({ id }) => id !== activeItem.id),
    [itemsDefault, activeItem.id]
  );

  const activeItemTitle = useMemo(() => {
    if (!activeItem || !activeItem.id) return "Select currency";

    return activeItem.name;
  }, [activeItem]);

  const [showDrop, setShowDrop] = useState(false);
  return (
    <div className="dropdown">
      <button
        className={`dropdown__button ${
          showDrop ? "dropdown__button_active" : ""
        }`}
        onClick={() => {
          setShowDrop(!showDrop);
        }}
      >
        <span>{activeItemTitle}</span> {DROP_ARROW_SVG}
      </button>

      {showDrop && (
        <div className="dropdown__items-block">
          {items.map((item) => (
            <button
              key={item.id}
              className="dropdown__item"
              onClick={() => {
                onItemClick(item);
                setShowDrop(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

DropBlock.propTypes = {
  items: PropTypes.array,
  activeItem: PropTypes.object,
  onItemClick: PropTypes.func,
};

DropBlock.defaultProps = {
  items: [],
  activeItem: {},
  onItemClick: () => {},
};

export default DropBlock;
