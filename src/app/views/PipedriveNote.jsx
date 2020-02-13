var React = require("react");

const PipedriveNote = props => {
  const { items, size, quantity, price, unitPrice } = props;
  return (
    <ul>
      {price && <li>Preço total: R$ {price}</li>}
      {unitPrice && <li>Preço unitario: ${unitPrice}</li>}
      {quantity && <li>quantidade: {quantity}</li>}
      {size && <li>medida: {size.x} x {size.y}</li>}
      {items && items.map((item, index) => <li key={index}>{item.option.name}: {item.name}</li>)}
    </ul>
  )
}

module.exports = PipedriveNote;