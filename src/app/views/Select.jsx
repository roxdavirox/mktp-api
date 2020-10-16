var React = require("react");

const Select = ({ items, optionId, selectedItemId, prevItem, option, defaultItems }) => {
  const { prevItemEntity, prevItemObj } = prevItem;
  const selectedItem = items.find(item => item._id.toString() === selectedItemId);
  const isSameItemType = selectedItem.itemType == prevItemEntity.itemType;
  const isSameUnitType = selectedItem.priceTable.unit == prevItemEntity.priceTable.unit;
  const usePrevValue = isSameItemType && isSameUnitType;
  return (
    <>
      <div key={optionId} className="elementor-row">
        <div 
          className={`${items.find(item => item._id.toString() === selectedItemId).showUnitField 
            ? 'elementor-column elementor-col-100 elementor-inner-column elementor-element' 
            : 'elementor-column elementor-col-100 elementor-inner-column elementor-element'}`}
          style={{ display: 'block' }}
        >
          <label for={optionId}>{option.name}:</label>
          <select
            className="item-select"
            id={optionId}
            key={optionId}>
            {items.map(item => 
              <option 
                key={optionId}
                id={optionId}
                _itemid={item._id.toString()}
                _optionid={optionId}
                _showunitfield={`${item.showUnitField || false}`}
                _unit={item.priceTable ? item.priceTable.unit : ''}
                selected={selectedItemId === item._id.toString()}>
                  {item.name}
              </option>)}
          </select>
        </div>
        {selectedItem.showUnitField 
          && selectedItem.priceTable.unit === 'quantidade'
          && <div _optionid={optionId} className="elementor-column elementor-col-50 elementor-inner-column elementor-element" style={{ display: 'block' }}>
              <label for={`input-unit-quantity`} >{defaultItems[selectedItemId] ? defaultItems[selectedItemId].label : usePrevValue ? prevItemObj.label : 'Quantidade'}:</label>
              <input
                type="text"
                id="input-unit-quantity"
                _itemId={selectedItemId}
                placeholder="Quantidade"
                type="number"
                value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].quantity : usePrevValue ? prevItemObj.quantity : '1'}
              >
              </input>
            </div>
        }
        {selectedItem.showUnitField 
          && selectedItem.priceTable.unit !== 'quantidade'
          &&
            <div _optionid={optionId} className="elementor-row" style={{ maxHeight: '100%', display: 'block' }}>
              <label for={`input-unit-x`} >{defaultItems[selectedItemId] ? defaultItems[selectedItemId].label : usePrevValue ? prevItemObj.label : 'Medida'}:</label>
              <div style={{ display: 'inline-flex' }}>
                <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element">
                  <input
                    type="text"
                    id="input-unit-x"
                    _itemid={selectedItemId}
                    placeholder="Comp."
                    type="number"
                    value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].x : usePrevValue ? prevItemObj.size.x : '1'}
                    >
                  </input>
                </div>
                <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element">
                  <input
                    type="text"
                    id="input-unit-y"
                    _itemid={selectedItemId}
                    placeholder="Larg."
                    type="number"
                    value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].y : usePrevValue ? prevItemObj.size.y : '1'}
                    >
                  </input>
                </div>
              </div>
            </div>
        }
      </div>
    </>
  )
}

module.exports = Select;
