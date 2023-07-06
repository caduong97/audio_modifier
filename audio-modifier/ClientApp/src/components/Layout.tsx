import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';
import "../styles/Layout.css"
interface LayoutProps {
  children: any
}

export function Layout({children}: LayoutProps) {

  return (
    <div className='layout'>
      <NavMenu />
      <Container tag="main" className='p-3 p-sm-4 pt-sm-5 p-xl-5'>
        {children}
      </Container>
      
    </div>
  )
}
