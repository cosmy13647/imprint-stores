import { useState } from "react"
import AdminOrders from "../components/admin/AdminOrders"
import AdminProducts from "../components/admin/AdminProducts"
import AdminPayments from "../components/admin/AdminPayments"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders')

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h2 style={{ color: '#088178', marginBottom: '20px' }}>Admin Dashboard</h2>
        <div className="admin-tabs">
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >Orders</button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >Products</button>
          <button
            className={activeTab === 'payments' ? 'active' : ''}
            onClick={() => setActiveTab('payments')}
          >Payments</button>
        </div>

        {activeTab === 'orders'   && <AdminOrders />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'payments' && <AdminPayments />}
      </div>
      <Footer />
    </>
  )
}