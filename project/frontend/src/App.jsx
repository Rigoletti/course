import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Authorization from './pages/auth/Authorization';
import Profile from './pages/profile/Profile';
import Category from './pages/category/Category';
import Project from './pages/project/Project';
import Admin from './pages/admin/Admin';
import Categories from './companents/admin/Categories';
import Orders from './companents/admin/Orders';
import OrderDetails from './companents/orders/OrderDetails';
import CompleteGithubRegistration from "./companents/auth/CompleteGithubRegistration";
import OrderPage from "./pages/orders/OrderPage";
import OrderRequests from "./companents/admin/OrderRequests";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/authorization' element={<Authorization />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:categoryLink" element={<Category />} />
        <Route path="/post-project" element={<Project />} />
        <Route path="/complete-profile" element={<CompleteGithubRegistration />} />
        <Route path="/orders/category/:categoryId" element={<OrderPage />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        
        <Route path="/admin/*" element={<Admin />}>
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="requests" element={<OrderRequests />} />
          <Route index element={<Categories />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;