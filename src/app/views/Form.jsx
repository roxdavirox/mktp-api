var React = require("react");

const styles = {
  container: {
    display: 'table-caption',
    maxWidth: '350px',
    justifyContent: 'space-between'
  },
  label: {
    width: '150px',
    margin: 'auto'
  },
  select: {
    width: '200px'
  },
  input: {
    width: '200px',
    maxWidth: '200px'
  },
  span: {
    width: '200px'
  },
  erro: {
    color: 'red',
    display: 'none'
  }
}

const Form = ({ sizeSelectedIndex = 0, options, sizes, selectedItemsId }) => {

  return (
    <>
      <form>
        <div style={styles.container}>
          <label htmlFor="quantity-select" style={styles.label}>Quantidade:</label>
          <input 
            type="number"
            defaultValue="1"
            id="quantity-select"
            className="orderby" 
            style={styles.input} />
        </div>
        <div style={styles.container}>
          {sizes && <label htmlFor="size-select" style={styles.label}>Medidas</label>}
          {sizes && 
            <select id="size-select" className="orderby" style={styles.select}>
              {sizes.map((size, index) => 
                <option 
                  key={index} 
                  _size={JSON.stringify(size)} 
                  selected={index == sizeSelectedIndex}>
                    {size.x}x{size.y}
                </option>)}
            </select>
          }
        </div>
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
        <div style={styles.container} className="orcamento-inputs">
          <label htmlFor="name" style={styles.label}>Nome:</label>
          <input type="text" id="name" style={styles.input}></input>
        </div>
        <div style={styles.container} className="orcamento-inputs">
          <label htmlFor="phone" style={styles.label} maxLength="15" placeholder="(__) _____-____">Telefone:</label>
          <input type="text" id="phone" style={styles.input}></input>
        </div>
        <div style={styles.container} className="orcamento-inputs">
          <label htmlFor="email" style={styles.label}>E-mail:</label>
          <input type="text" id="email" style={styles.input}></input>
        </div>
        <div style={styles.container} className="orcamento-inputs">
          <p id="erro" style={styles.erro}>E-mail inválido</p>
        </div>
        <div style={{ float: 'right' }}>
          <button id="ver-preco-button" className="single_add_to_cart_button button alt">Ver preço</button>
        </div>
      </form>
    </>
  )
};

module.exports = Form;
