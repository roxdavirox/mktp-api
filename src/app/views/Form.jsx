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

const Form = ({ sizeSelectedIndex = 0, options, sizes, selectedItemsId }) => {

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
                    {size.x}x{size.y}
                </option>)}
            </select>
          }
        </div>
        {Object.keys(options).map(k => 
          <div key={k}>
              <label for={options[k]._id} >{options[k].name}:</label> 
            <select 
              className="item-select"
              id={options[k]._id}
              key={k}>
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
        <div  className="orcamento-inputs">
          <label htmlFor="name" >Nome:</label>
          <input type="text" id="name" ></input>
        </div>
        <div className="orcamento-inputs">
          <label htmlFor="phone" placeholder="(__) _____-____">Telefone:</label>
          <input type="text" id="phone" ></input>
        </div>
        <div  className="orcamento-inputs">
          <label htmlFor="email" >E-mail:</label>
          <input type="text" id="email" ></input>
        </div>
        <div className="orcamento-inputs">
          <p id="erro" style={styles.erro}>E-mail inválido</p>
        </div>
        <div>
          <button id="ver-preco-button" className="single_add_to_cart_button button alt">Ver preço</button>
        </div>
      </form>
    </>
  )
};

module.exports = Form;
