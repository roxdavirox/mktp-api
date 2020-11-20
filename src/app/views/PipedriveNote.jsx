var React = require("react");

const PipedriveNote = props => {
  const { productName, items, size, quantity, price, unitPrice, url } = props;
  return (
    <ul>
      {productName && <li>Produto: {productName}</li>}
      {price && <li>Preço total: R$ {price}</li>}
      {unitPrice && <li>Preço unitario: R${unitPrice}</li>}
      {quantity && <li>quantidade: {quantity}</li>}
      {size && <li>medida: {size.x} x {size.y}</li>}
      {items && items.map((item, index) => <li key={index}>{item.option.name}: {item.name}</li>)}
      <li>Link <a href={url}>aqui</a></li>
    </ul>
  )
}

module.exports = PipedriveNote;