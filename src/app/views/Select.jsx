var React = require("react");

const Select = ({ items, optionId, selectedItemId, option, defaultItems }) => {

  const selectedItem = items.find(item => item._id.toString() === selectedItemId);
  return (
    <div _optionId={optionId}>
      <label for={optionId}>{option.name}:</label>
      <div key={optionId} className="elementor-row">
        <div 
          className={`${items.find(item => item._id.toString() === selectedItemId).showUnitField 
            ? 'elementor-column elementor-col-100 elementor-inner-column elementor-element' 
            : 'elementor-column elementor-col-100 elementor-inner-column elementor-element'}`}
        >
          <select
            className="item-select"
            id={optionId}
            key={optionId}>
            {items.map(item => 
              <option 
                key={item._id}
                id={item._id}
                _optionId={optionId}
                _showUnitfield={`${item.showUnitField}`}
                _unit={item.priceTable ? item.priceTable.unit : ''}
                selected={selectedItemId === item._id.toString()}>
                  {item.name}
              </option>)}
          </select>
        </div>
        {selectedItem.showUnitField 
          && selectedItem.priceTable.unit === 'quantidade'
          && <div _optionId={optionId} className="elementor-column elementor-col-50 elementor-inner-column elementor-element">
              <input type="text" id="input-quantidade" placeholder="Quantidade" type="number"
                value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].quantity : '1'}></input>
            </div>
        }
        {selectedItem.showUnitField 
          && selectedItem.priceTable.unit !== 'quantidade'
          &&
            <div _optionId={optionId} className="elementor-row">
              <div  className="elementor-column elementor-col-50 elementor-inner-column elementor-element">
                <input type="text" id="input-x" placeholder="Comp." type="number"
                  value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].x : '1'}></input>
              </div>
              <div  className="elementor-column elementor-col-50 elementor-inner-column elementor-element">
                <input type="text" id="input-y" placeholder="Larg." type="number"
                  value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].y : '1'}></input>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

module.exports = Select;
