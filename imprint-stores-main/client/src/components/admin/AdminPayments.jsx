import { useState ,useEffect } from "react";
import React from 'react'
import api from '../../services/api'

export default function AdminPayments() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get('/payments/admin/all')
            .then(res => setPayments(res.data))
            .catch(() => setError('Failed to load payments'))
            .finally(() => setLoading(false))
    }, [])

    return (   
    <div>
        <h3>All payments</h3>
        {loading && <p>Loading payments...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
    <table className="admin-table" >

<thead>
    <tr>
        <th>Order ID</th>
        <th>Order Status</th>
        <th>Payment Status</th>
        <th>M-Pesa Receipt</th>
        <th>Confirmed At</th>
        <th>Amount</th>
    </tr>
</thead>
<tbody>
    {payments.map((payment, i) => (
        <tr key={`${payment.order_id}-${i}`}>
            <td>{payment.order_id.slice(0, 8).toUpperCase()}</td> 
            <td>{payment.order_status}</td>
            <td>{payment.payment_status || 'N/A'}</td>
            <td>{payment.mpesa_receipt || 'N/A'}</td>

            <td>{payment.confirmed_at ? new Date(payment.confirmed_at).toLocaleString() : 'N/A'}</td> 
            <td>{payment.amount != null ? `KSh ${Number(payment.amount).toLocaleString('en-KE')}` : 'N/A'}</td>
        </tr>
    ))} 
</tbody>




    </table>
    </div>

    )
}