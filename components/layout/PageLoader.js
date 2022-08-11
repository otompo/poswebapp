import React from 'react';
import styles from '../styles/Loading.module.css';

function PageLoader(props) {
  return (
    <div className="d-flex justify-content-center center-loader">
      <div className={styles.lds_ellipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default PageLoader;
