var React = require("react");

const styles = {
  container: {
    display: 'flex',
    maxWidth: '300px',
    justifyContent: 'space-between'
  },
  label: {
    width: '150px',
    margin: 'auto'
  },
  select: {
    width: '150px'
  },
  input: {
    width: '150px'
  }
}

const Form = ({ product, options, sizes, selectedItemsId }) => {

  return (
    <>
      <div>Produto: {product.name} </div>
      <form>
        <div style={styles.container}>
          <label for="quantity-select" style={styles.label}>Quantidade:</label>
          <input 
            type="number"
            defaultValue="1"
            id="quantity-select"
            className="orderby" 
            style={styles.input} />
        </div>
        {sizes && <label for="size-select" style={styles.label}>Medidas</label>}
        {sizes && 
          <div >
            <select id="size-select" className="orderby" style={styles.select}>
              {sizes.map((size, index) => 
                <option 
                  key={index} 
                  _size={JSON.stringify(size)} 
                  selected={index == 1}>
                    {size.x} x {size.y}
                </option>)}
            </select>
          </div>}
        {Object.keys(options).map(k => 
          <div key={k} className="orderby" style={styles.container}>
              <label for={options[k]._id} style={styles.label}>{options[k].name}:</label> 
            <select 
              className="item-select"
              id={options[k]._id}
              key={k}
              style={styles.select}>
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
        <div style={{ float: 'right' }}>
          <button id="ver-preco-button" className="single_add_to_cart_button button alt">Ver preço</button>
        </div>
      </form>
    </>
  )
};

module.exports = Form;
