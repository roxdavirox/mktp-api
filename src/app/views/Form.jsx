var React = require("react");

const style = {
  fontSize: "1.5em",
  textAlign: "center",
  color: "white",
  backgroundColor: "red"
};

const Form = props => {
  const { product, options } = props;
  
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
        {Object.keys(options).map(k => 
          <div key={k} className="orderby">
              {options[k].name}: 
            <select key={k}>
              {options[k].items.map(item => <option key={item._id}>{item.name}</option>)}
            </select>
          </div>
        )}
        <button id="ver-preco-button" className="single_add_to_cart_button button alt">Ver preço</button>
      </form>
    </>
  )
};

module.exports = Form;
