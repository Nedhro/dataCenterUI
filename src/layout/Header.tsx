/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import '../static/scss/Custom.scss';
import banner from '../static/img/dghs_banner.png';

function Header() {
  return (
    <nav>
        <div className="">
            <a href="">
            <img src={banner} width="100%" height="150px" alt="Banner"/>
            </a>
        </div>
    </nav>
   
  );
}

export default Header;
