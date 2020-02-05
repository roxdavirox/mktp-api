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
      <ul>
        {Object.keys(options).map(k => 
          <li key={options[k]._id}>{options[k].name}
            <ul>
              {options[k].items.map(item => <li key={item._id}>{item.name}</li>)}
            </ul>
          </li>
        )}
      </ul>
    </>
  )
};

module.exports = Form;
