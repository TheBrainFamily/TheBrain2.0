import React from 'react'

const List = ({ items, onClick }) => <ul onClick={onClick}>{items.map(item => <li key={item} className={item}>{item}</li>)}</ul>

List.defaultProps = {
  items: []
}

export default List
