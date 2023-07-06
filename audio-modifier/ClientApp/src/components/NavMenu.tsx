import React, { Component, useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { NavLink as RouteNavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/NavMenu.css';

export function NavMenu() {

  const [collapsed, setCollapsed] = useState(true)
  const toggleNavbar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-light border-bottom box-shadow mb-3 h-100 flex flex-sm-column flex-row" container={false} light>
        <NavbarBrand className='mb-2 mx-3' tag={Link} to="/">audio_modifier</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mb-2 mx-3" />
        <Collapse className="align-items-start me-auto w-100" isOpen={collapsed} navbar>
          <Nav vertical pills className="w-100">
            <NavItem>
              {/* <NavLink tag={Link} className="text-dark" href='/'>Home</NavLink> */}
              <RouteNavLink className="nav-link" to="/">Home</RouteNavLink>
            </NavItem>
            <NavItem>
              {/* <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink> */}
              <RouteNavLink className="nav-link" to="/counter">Counter</RouteNavLink>
            </NavItem>
            <NavItem>
              {/* <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink> */}
              <RouteNavLink className="nav-link" to="/fetch-data">Fetch data</RouteNavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  )
}
