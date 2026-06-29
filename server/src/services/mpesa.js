import axios from 'axios'
const BASE_URL = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'
 export async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')
   const { data } = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  )
  return data.access_token
}
export function formatPhone(phone) {
  const clean = phone.replace(/\D/g, '')
  if (clean.startsWith('254')) return clean
  if (clean.startsWith('0'))   return '254' + clean.slice(1)
  if (clean.startsWith('7') || clean.startsWith('1')) return '254' + clean
  throw new Error('Invalid Kenyan phone number')
}

export async function initiateSTKPush({ phone, amount, orderId }) {
 
    const token     = await getAccessToken()
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  const password  = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64')

  const formattedPhone = formatPhone(phone)
console.log('Callback URL:', process.env.MPESA_CALLBACK_URL) 
  const { data } = await axios.post(
    `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   'CustomerPayBillOnline',
      Amount:            Math.ceil(amount),
      PartyA:            formattedPhone,
      PartyB:            process.env.MPESA_SHORTCODE,
      PhoneNumber:       formattedPhone,
      CallBackURL:       process.env.MPESA_CALLBACK_URL,
      AccountReference:  orderId.slice(0, 12),
      TransactionDesc:   `Order ${orderId.slice(0, 8)}`
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return data
}