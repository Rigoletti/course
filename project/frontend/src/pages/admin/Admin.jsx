import React from "react";
import Header from "../../companents/layout/Header";
import AdminPanel from "../../companents/admin/AdminPanel";
import '../../assets/style/admin/adminStyles.css';

const Admin = () => {
  return (
    <div className="admin-page">
      <Header className="admin-header" />
      <div className="admin-content-container">
        <AdminPanel />
      </div>
    </div>
  );
};

export default Admin;