import { useState } from 'react';
import { decrease, conform, removeFromCart } from '../actions/Actions';
import {
  CheckOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import Zoom from 'react-reveal/Zoom';
import { toast } from 'react-hot-toast';

function PurchaseCart({ item, dispatch, cart }) {
  const [count, setCount] = useState('');
  const [countConfirm, setCountConfirm] = useState(false);

  const handleConfirm = () => {
    setCountConfirm(true);
    toast.success('Confirm');
  };
  return (
    <div>
      <div className="cart">
        <Zoom>
          <ul className="cart-items">
            <>
              <div className="row">
                <div className="col-md-5">
                  <h6> {item.name}</h6>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="stockCounter d-inline">
                        <button
                          className={
                            countConfirm ? 'btn btn-success' : 'btn btn-danger'
                          }
                          // onClick={() => dispatch(decrease(cart, item._id))}
                          // disabled={item.count === 1 ? true : false}
                        >
                          {countConfirm ? (
                            <CheckOutlined />
                          ) : (
                            <CloseCircleOutlined />
                          )}{' '}
                        </button>

                        {/* <span className="px-3">{item.count}</span> */}
                        <input
                          type="number"
                          value={count}
                          onChange={(e) => setCount(e.target.value)}
                          className="formcount"
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            handleConfirm();
                            dispatch(conform(cart, count, item._id));
                          }}
                          disabled={count <= 0}
                        >
                          {' '}
                          +{' '}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-1 deletbtn">
                  <DeleteOutlined
                    style={{ fontSize: '28px' }}
                    onClick={() => dispatch(removeFromCart(cart, item._id))}
                  />
                </div>
              </div>
              <hr />
              {/* <h6>Total</h6>
                <p>{Number(item.price) * item.count}</p> */}
            </>
          </ul>
        </Zoom>
      </div>
    </div>
  );
}

export default PurchaseCart;
