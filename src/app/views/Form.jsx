var React = require("react");

const styles = {
  container: {
    display: 'table-caption',
    maxWidth: '450px',
    justifyContent: 'space-between'
  },
  label: {
    width: '150px',
    margin: 'auto'
  },
  select: {
    width: '450px'
  },
  input: {
    width: '450px',
    maxWidth: '4500px'
  },
  span: {
    width: '200px'
  },
  erro: {
    color: 'red',
    display: 'none'
  }
}

const Form = ({ sizeSelectedIndex = 0, options, sortedOptionsId, sizes, selectedItemsId, unit, defaultItems }) => {

  return (
    <>
      <form>
        <div >
          <label htmlFor="quantity-select" >Quantidade:</label>
          <input 
            type="number"
            defaultValue="1"
            id="quantity-select"
             />
        </div>
        <div >
          {sizes && <label htmlFor="size-select">Medidas</label>}
          {sizes && 
            <select id="size-select" >
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
        {sortedOptionsId.map(k =>
          <div _optionId={options[k]._id} id="item-container">
            <div key={k} className="elementor-row">
              <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element" style={{ display: 'block' }}>
                <label for={options[k]._id} >{options[k].name}:</label>
                <select
                  className="item-select"
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
              {options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)
                && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).showUnitField
                && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable
                && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable.unit === 'quantidade'
                && 
                  <div _optionId={options[k]._id} className="elementor-column elementor-col-50 elementor-inner-column elementor-element" style={{ display: 'block' }}>
                    <label for={`input-unit-quantity`} >{defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].label || 'quantidade'}:</label>
                    <input
                      type="text"
                      id={`input-unit-quantity`}
                      _itemId={options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()}
                      placeholder="Quantidade"
                      type="number"
                      value={defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()] 
                        ? defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].quantity
                        : '1'}
                    >
                    </input>
                  </div>
              }
              {options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)
                && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).showUnitField
                && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable
                && options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1).priceTable.unit !== 'quantidade'
                && 
                  <div _optionId={options[k]._id} className="elementor-row" style={{ maxHeight: '100%', display: 'block' }}>
                    <label >{defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].label || 'medida'}:</label>
                    <div style={{ display: 'inline-flex' }}>
                      <div className="elementor-column elementor-col-50 elementor-inner-column elementor-element">
                        <input 
                          type="text"
                          id="input-unit-x"
                          _itemId={options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()}
                          placeholder="Comp."
                          type="number"
                          value={defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()]
                            ? defaultItems[options[k].items.find(item => selectedItemsId.indexOf(item._id.toString()) !== -1)._id.toString()].x
                            : '1'}></input>
                      </div>
                      <div  className="elementor-column elementor-col-50 elementor-inner-column elementor-element">
                        <input
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
          </div>
        )}
        <div  className="orcamento-inputs">
          <label htmlFor="name" >Nome:</label>
          <input type="text" id="name" ></input>
        </div>
        <div className="orcamento-inputs">
          <p id="name-error" style={styles.erro}>Preencha o seu nome</p>
        </div>
        <div className="orcamento-inputs">
          <label htmlFor="phone" placeholder="(__) _____-____">Telefone:</label>
          <input type="text" id="phone" maxLength="15"></input>
        </div>
        <div className="orcamento-inputs">
          <p id="phone-error" style={styles.erro}>Preencha seu telefone</p>
        </div>
        <div  className="orcamento-inputs">
          <label htmlFor="email" >E-mail:</label>
          <input type="text" id="email" ></input>
        </div>
        <div className="orcamento-inputs">
          <p id="email-error" style={styles.erro}>E-mail inválido</p>
        </div>
        <div>
          <button id="ver-preco-button" className="single_add_to_cart_button button alt">Ver preço</button>
        </div>
      </form>
    </>
  )
};

module.exports = Form;
