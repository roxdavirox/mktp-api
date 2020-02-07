var React = require("react");

const Form = ({ product, options, sizes, selectedItemsId }) => {

  return (
    <>
      <div>Produto: {product.name} </div>
      <form>
        Quantidade:
        <select id="quantity-select" className="orderby">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
        </select>
        <br />
        Medidas:
        {sizes && 
          <select id="size-select" className="orderby">
            {sizes.map((size, index) => 
              <option key={index} _size={JSON.stringify(size)} selected={index == 1}>{size.x} x {size.y}</option>)}
          </select>}
        {Object.keys(options).map(k => 
          <div key={k} className="orderby">
              {options[k].name}: 
            <select className="item-select" key={k}>
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
