import { Fragment } from 'react';
import { Avatar } from 'antd';

const Card = ({ icon, cade_title, cade_total, backgroundColor }) => {
  return (
    <Fragment>
      <div className="col-md-3">
        <div className="card admin_card" style={{ backgroundColor }}>
          <div className="card-body">
            <h5 className="card-title">{cade_title}</h5>
            <p>
              <h6 display="4" className="lead py-3 text-white">
                {cade_total}
              </h6>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Card;
