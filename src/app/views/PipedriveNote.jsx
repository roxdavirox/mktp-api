var React = require("react");

const PipedriveNote = props => {
  const { items } = props;
  return (
    <ul>
      {items && items.map((item, index) => <li key={index}>{item.option.name}: {item.name}</li>)}
    </ul>
  )
}

module.exports = PipedriveNote;