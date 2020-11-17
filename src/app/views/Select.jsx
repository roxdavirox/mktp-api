var React = require("react");

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
    width: '-webkit-fill-available'
  },
  box: {
    flexGrow: 1,
    padding: '1px',
    width: '200px',
  },
  boxItem: {
    width: '100%',
    border: 'solid 1px black',
    padding: '11.25px',
    minHeight: '46.5px'
  },
  boxInput: {
    flexGrow: 1,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  }
}

const Select = ({ items, optionId, selectedItemId, prevItem, option, defaultItems = {} }) => {
  const { prevItemEntity, prevItemObj } = prevItem;
  const selectedItem = items.find(item => item._id.toString() === selectedItemId);
  const isNotTemplateItem = selectedItem.itemType !== 'template' && prevItemEntity.itemType !== 'template';
  const isSameItemType = selectedItem.itemType == prevItemEntity.itemType;
  const isSameUnitType = isNotTemplateItem && selectedItem.priceTable.unit == prevItemEntity.priceTable.unit;
  const usePrevValue = isSameItemType && isSameUnitType;
  return (
    <>
      <div style={styles.box}>
        <div style={{ marginBottom:  '0px;' }}>{option.name}:</div>
        <div>
          <select
            className="item-select"
            style={styles.boxItem}
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
      </div>
      
      {/* quantidade */}
      {selectedItem.showUnitField 
        && selectedItem.priceTable.unit === 'quantidade'
        && <div _optionid={optionId} style={styles.box}>
            <div style={{ marginBottom:  '0px;' }}>
              {defaultItems[selectedItemId] ? defaultItems[selectedItemId].label : usePrevValue ? prevItemObj.label : 'Quantidade:'}
            </div>
            <div style={{ paddingLeft: '3px'}}>
              <input
                style={styles.boxItem}
                type="text"
                id="input-unit-quantity"
                _itemId={selectedItemId}
                placeholder="Quantidade"
                type="number"
                value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].quantity : usePrevValue ? prevItemObj.quantity : '1'}
              />
            </div>
          </div>
      }

      {/* medida */}
      {selectedItem.showUnitField 
        && selectedItem.priceTable.unit !== 'quantidade'
        &&
          <div _optionid={optionId} style={styles.box}>
            <div style={{ marginBottom: '0px;' }}>
              {defaultItems[selectedItemId] ? defaultItems[selectedItemId].label : usePrevValue ? prevItemObj.label : 'Medida:'}
            </div>
            <div style={styles.boxInput}>
              <div style={{ paddingLeft: '3px', paddingRight: '5px' }}>
                <input
                  style={styles.boxItem}
                  type="text"
                  id="input-unit-x"
                  _itemid={selectedItemId}
                  placeholder="Comp."
                  type="number"
                  value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].x : usePrevValue ? prevItemObj.size.x : '1'}
                 />
              </div>
              <div>
                <input
                  style={styles.boxItem}
                  type="text"
                  id="input-unit-y"
                  _itemid={selectedItemId}
                  placeholder="Larg."
                  type="number"
                  value={defaultItems[selectedItemId] ? defaultItems[selectedItemId].y : usePrevValue ? prevItemObj.size.y : '1'}
                 />
              </div>
            </div>
          </div>
      }
    </>
  )
}

module.exports = Select;
