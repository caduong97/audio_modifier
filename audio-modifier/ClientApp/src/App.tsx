import React, { Component } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import Home from './pages/Home';

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
