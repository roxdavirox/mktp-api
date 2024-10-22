var React = require("react");

const styles = {
  label: {
    width: '150px',
    margin: 'auto'
  },
  span: {
    width: '200px'
  },
  erro: {
    color: 'red',
    display: 'none'
  },
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

const Form = ({ sizeSelectedIndex = 0, options, sortedOptionsId, sizes, selectedItemsId, unit, defaultItems }) => {

  return (
    <>
      <div className="elementor-widget-container">
        <div>
          <div style={styles.container}>
            <div style={styles.box}>
              <div style={{ marginBottom: '0px;' }}>Quantidade:</div>
              <div>
                <input 
                  type="number"
                  style={styles.boxItem}
                  defaultValue="1"
                  id="quantity-select"
                />
              </div>
            </div>
          </div>

          <div style={styles.container}>
            {sizes && 
              <div style={styles.box}>
                <div style={{ marginBottom:  '0px;' }}>Medidas:</div>
                <div>
                  {sizes && 
                    <select id="size-select" style={styles.boxItem}>
                      {sizes.map((size, index) => 
                        <option 
                          key={index} 
                          _size={JSON.stringify(size)} 
                          selected={index == sizeSelectedIndex}>
                            {size.x}x{size.y}{unit}
                        </option>)}
                    </select>
                  }
                </div>
            </div>
            }
          </div>

          {sortedOptionsId.map(k =>
            <div 
              key={k}
              _optionId={options[k]._id}
              id="item-container"
              style={styles.container}
            >
                <div style={styles.box}>
                  <div style={{ marginBottom: '0px;' }}>{options[k].name}:</div>
                  <div>
                    <select
                      className="item-select"
                      style={styles.boxItem}
                      id={options[k]._id}
                      key={k}>
                      {options[k].items.map(item => 
                        <option
                          key={options[k]._id}
                          id={options[k]._id}
                          _itemid={item._id.toString()}
                          _optionId={options[k]._id}
                          _showUnitfield={`${item.showUnitField || false}`}
                          _unit={item.priceTable ? item.priceTable : ''}
                          selected={selectedItemsId.indexOf(item._id.toString()) !== -1}>
                            {item.name}
                        </option>)}
                    </select>
                  </div>
                </div>

                {/* quantidade */}
                {options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)
                  && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).showUnitField
                  && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable
                  && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable.unit === 'quantidade'
                  && 
                    <div _optionId={options[k]._id} style={styles.box}>
                      <div style={{ marginBottom:  '0px', paddingLeft: '3px' }}>
                        {defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].label || 'Quantidade'}:
                      </div>
                      <div style={{ paddingLeft: '3px'}}>
                        <input
                          style={styles.boxItem}
                          type="text"
                          id={`input-unit-quantity`}
                          _itemId={options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()}
                          placeholder="Quantidade"
                          type="number"
                          value={defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()] 
                            ? defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].quantity
                            : '1'}
                        />
                      </div>
                    </div>
                }

                {/* medidas */}
                {options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)
                  && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).showUnitField
                  && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable
                  && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable.unit !== 'quantidade'
                  && 
                    <div _optionId={options[k]._id} style={styles.box}>
                      <div style={{ marginBottom: '0px', paddingLeft: '3px' }}>
                        {defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].label || 'Medida'}:
                      </div>
                      <div style={styles.boxInput}>
                        <div style={{ paddingLeft: '3px', paddingRight: '5px' }}>
                          <input 
                            style={styles.boxItem}
                            type="text"
                            id="input-unit-x"
                            _itemId={options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()}
                            placeholder="Comp."
                            type="number"
                            value={defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()]
                              ? defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].x
                              : '1'}></input>
                        </div>
                        <div>
                          <input
                            style={styles.boxItem}
                            type="text"
                            id="input-unit-y"
                            _itemId={options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()}
                            placeholder="Larg."
                            type="number"
                            value={defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()]
                              ? defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].y
                              : '1'}
                          >
                          </input>
                        </div>
                      </div>
                    </div>
                }
            </div>
          )}
          <div style={styles.container}>
            <div style={styles.box} className="orcamento-inputs">
              <div style={{ marginBottom:  '0px' }}>Nome:</div>
              <div>
                <input type="text" id="name" style={styles.boxItem} />
              </div>
            </div>
          </div>
          <div className="orcamento-inputs">
            <p id="name-error" style={styles.erro}>Preencha o seu nome</p>
          </div>
          
          <div style={styles.container}>
            <div className="orcamento-inputs" style={styles.box}>
              <label
                htmlFor="phone"
                placeholder="(__) _____-____"
                style={{ marginBottom:  '0px' }}       
              >
                Telefone:
              </label>
              <div>
                <input type="text" id="phone" maxLength="15" style={styles.boxItem} />
              </div>
            </div>
          </div>
          <div className="orcamento-inputs">
            <p id="phone-error" style={styles.erro}>Preencha seu telefone</p>
          </div>

          <div style={styles.container}>
            <div className="orcamento-inputs" style={styles.box}>
              <label htmlFor="email" style={{ marginBottom:  '0px' }}>
                E-mail:
              </label>
              <div>
                <input type="text" id="email" style={styles.boxItem} />
              </div>
            </div>
          </div>
          <div className="orcamento-inputs">
            <p id="email-error" style={styles.erro}>E-mail inválido</p>
          </div>
          <div style={{ textAlign: 'right', width: '100%' }}>
            <button id="ver-preco-button" className="single_add_to_cart_button button alt">Ver preço</button>
          </div>
        </div>
      </div>
    </>
  )
};

module.exports = Form;
