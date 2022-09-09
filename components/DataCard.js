import React from 'react';

function DataCard({ title, SubTitle }) {
  return (
    <div className="containerItems">
      <div className="content">
        <h4>{title}</h4>
        <p>{SubTitle} </p>
      </div>
    </div>
  );
}

export default DataCard;
