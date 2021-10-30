import React from 'react';
import '../static/scss/Custom.scss';
import banner from '../static/img/dghs_top_banner_new.png';

function Header() {
  return (
    <nav>
      <div className="container-fluid">
        <div className="header justify-content-center">
          <img className="headerImage" src={banner} alt="Banner"/>
        </div>
      </div>
    </nav>
  );
}

export default Header;
