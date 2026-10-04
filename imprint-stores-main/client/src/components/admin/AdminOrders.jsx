import { useState ,useEffect } from "react";
import React from 'react'
import api from '../../services/api'
export default function AdminOrders ()  {
    const [orders, setOrders] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
    useEffect(() => {
  api.get('/orders/admin/all')

      .then(res => setOrders(res.data))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])
const updateStatus = async (orderId, newStatus) => {
  try {
    await api.patch(`/orders/${orderId}/status`, { status: newStatus })
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  } catch {
    alert('Failed to update order status')
  }
}
return (
  <div>
  {loading && <p>Loading orders...</p>}
  {error && <p style={{ color: 'red' }}>{error}</p>}
  {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}
  <table className="admin-table" >
  <thead>
    <tr>
      <td>Order ID</td>
      <td>Customer</td>
      <td>Total</td>
      <td>Status</td>
      <td>Date</td>
    </tr>
  </thead>
  <tbody>
    {orders.map(order => (
      <tr key={order.id}>
        <td>{order.id.slice(0, 8).toUpperCase()}</td>
        <td>{order.user_email}</td>
        <td>KSh {Number(order.total_amount || 0).toLocaleString('en-KE')}</td>
        <td>
  <select
    value={order.status}
    onChange={(e) => updateStatus(order.id, e.target.value)}
  >
    <option value="pending">Pending</option>
    <option value="paid">Paid</option>
    <option value="processing">Processing</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
    <option value="cancelled">Cancelled</option>
  </select>
</td>
        <td>{new Date(order.created_at).toLocaleDateString()}</td>
      </tr>
    ))}
  </tbody>
</table>
  </div>
)
}