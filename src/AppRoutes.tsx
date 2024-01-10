import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AddResult } from './pages/AddResult';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<Home />}></Route>
      <Route path="add" element={<AddResult />}></Route>
    </Routes>
  );
}
