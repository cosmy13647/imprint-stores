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
        <h3>All Payments</h3>
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
    {payments.map(payment => (
        <tr key={payment.id}>
            <td>{payment.order_id.slice(0, 8).toUpperCase()}</td> 
            <td>{payment.order_status}</td>
            <td>{payment.payment_status}</td>
            <td>{payment.mpesa_receipt}</td>

            <td>{payment.confirmed_at ? new Date(payment.confirmed_at).toLocaleString() : 'N/A'}</td> 
            <td>${payment.amount}</td>
        </tr>
    ))} 
</tbody>




    </table>
    </div>

    )
}