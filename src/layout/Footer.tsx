import React from 'react';
import '../static/scss/Custom.scss';

function Footer() {
  return (
    <div className="container-fluid">
      <div className="footer">
        <span>Copyright &copy; {new Date().getFullYear()} <a href="https://www.dghs.gov.bd/" target="blank"> MIS, DGHS</a></span>&nbsp; &nbsp;
        <span>Technical assistance by :&nbsp;
          <a href="https://ctechbd.com/" target="blank">
            Crystal Technology Bangladesh Ltd.
          </a>
        </span>
      </div>
    </div>
  );
}

export default Footer;
