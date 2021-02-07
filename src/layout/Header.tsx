import React from 'react';
import '../static/scss/Custom.scss';
import banner from '../static/img/dghs_banner.png';

function Header() {
  return (
    <nav>
        <div className="container-fluid">
          <div className="header">
              <img className="headerImage" src={banner} alt="Banner"/>
          </div>
        </div>
    </nav> 
  );
}

export default Header;
