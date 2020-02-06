var React = require("react");

const Form = ({ product, options, sizes, selectedItemsId }) => {

  return (
    <>
      <div>Produto: {product.name} </div>
      <form>
        Quantidade:
        <select className="orderby">
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
        <br />
        Medidas:
        {sizes && 
          <select className="orderby">
            {sizes.map((size, index) => 
              <option key={index} selected={index == 1}>{size.x} x {size.y}</option>)}
          </select>}
        {Object.keys(options).map(k => 
          <div key={k} className="orderby">
              {options[k].name}: 
            <select key={k}>
              {options[k].items.map(item => 
                <option 
                  key={item._id}
                  id={item._id}
                  selected={selectedItemsId.indexOf(item._id.toString()) !== -1}>
                    {item.name}
                </option>)}
            </select>
          </div>
        )}
        <button id="ver-preco-button" className="single_add_to_cart_button button alt">Ver preço</button>
      </form>
    </>
  )
};

module.exports = Form;
