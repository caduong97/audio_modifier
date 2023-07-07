import React, { Component, useState } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { NavLink as RouteNavLink, useRoutes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/NavMenu.css';
import { routeConfig } from '../AppRoutes';

export function NavMenu() {

  const [collapsed, setCollapsed] = useState(true)
  const toggleNavbar = () => {
    setCollapsed(!collapsed)
  }

  const allAppRoutes = routeConfig && routeConfig[0].children 
    ? routeConfig[0].children
        .sort((a, b) => !!a.index || !!b.index || (a.id && b.id && a.id > b.id) ? 1 : -1)
        .map(cr => {
          return {
            to: cr.index ? "/" : cr.path as string,
            name: cr.id
          }
        }) 
    : []


  return (
    <header>
      <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-light border-bottom box-shadow mb-3 h-100 flex flex-sm-column flex-row" container={false} light>
        <NavbarBrand className='mb-2 mx-3' tag={Link} to="/">audio_modifier</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mb-2 mx-3" />
        <Collapse className="align-items-start me-auto w-100" isOpen={collapsed} navbar>
          <Nav vertical pills className="w-100">
            {
              allAppRoutes.map(r => (
                <NavItem key={r.name}>
                  {/* <NavLink tag={Link} className="text-dark" href='/'>Home</NavLink> */}
                  <RouteNavLink className="nav-link" to={r.to}>{r.name}</RouteNavLink>
                </NavItem>
              ))
            }
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  )
}
