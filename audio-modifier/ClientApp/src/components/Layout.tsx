import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

interface LayoutProps {
  children: any
}

export function Layout({children}: LayoutProps) {

  return (
    <div>
      <NavMenu />
      <Container tag="main">
        {children}
      </Container>
    </div>
  )
}
