import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";

function Sidebar() {
  const location = useLocation();

  // Function to check if the current link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <input id='menu__toggle' type='checkbox' />
      <label className='menu__btn' htmlFor='menu__toggle'>
        <span></span>
      </label>
      <nav className='sidebar'>
        <header>
          <div className='image-text'>
            <span className='image'>
              <img src={require("../../assests/logo.png")} alt='' />
            </span>

            <div className='text logo-text'>
              <span className='name'>MailFlow</span>
            </div>
          </div>
        </header>

        <div className='menu-bar'>
          <div className='menu'>
            <ul className='menu-links'>
              <li className={`nav-link ${isActive('/')}`}>
                <Link to='/'>
                  <i className='fa-sharp fa-solid fa-gauge-high icon'></i>
                  <span className='text nav-text'>Dashboard</span>
                </Link>
              </li>

              <li className={`nav-link ${isActive('/mailer')}`}>
                <Link to='/mailer'>
                  <i className='fa-sharp fa-solid fa-envelopes-bulk icon'></i>
                  <span className='text nav-text'>Mailer</span>
                </Link>
              </li>

              <li className={`nav-link ${isActive('/groups')}`}>
                <Link to='/groups'>
                  <i className='fa-sharp fa-solid fa-user-group icon'></i>
                  <span className='text nav-text'>Groups</span>
                </Link>
              </li>

              <li className={`nav-link ${isActive('/sentdetails')}`}>
                <Link to='/sentdetails'>
                  <i className='fa-sharp fa-solid fa-paper-plane icon'></i>
                  <span className='text nav-text'>Sent</span>
                </Link>
              </li>

              <li className={`nav-link ${isActive('/templates')}`}>
                <Link to='/templates'>
                  <i className='fa-solid fa-table-columns icon'></i>
                  <span className='text nav-text'>Templates</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className='bottom-content'>
            {/* Bottom content remains the same */}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;