# SMS2Connect Node.js SDK

A lightweight, zero-dependency Node.js wrapper for the **SMS2Connect** API using native modern JavaScript `fetch`.

This SDK is engineered to handle transactional SMS broadcasting, customer alerts, and OTP verification across modern Node.js environments.

---

## Features

- Zero dependencies (native `fetch`)
- Async/await support
- Send SMS / OTP
- Check account balance
- Track delivery status
- Structured error handling
- Server-side integration examples

---

## Installation

Ensure you are using **Node.js 18+**.

```bash
npm install sms2connect-node
# or
yarn add sms2connect-node
# or
pnpm add sms2connect-node
```

---

## Initialization

NextJS or ReactJs
```javascript
import SMS2Connect from 'sms2connect-node';

const smsClient = new SMS2Connect(
  process.env.SMS2CONNECT_API_KEY || 'YOUR_SECRET_API_KEY'
);


```
Node Js
```javascript
const SMS2Connect = require('sms2connect-node');

const smsClient = new SMS2Connect(
  process.env.SMS2CONNECT_API_KEY || 'YOUR_SECRET_API_KEY'
);
```

---

## API Methods

### 1. sendSMS(options)

Send SMS or OTP messages.

| Parameter | Type | Required | Description |
|---|---|---|---|
| senderId | string | Yes | Approved sender ID |
| mobile | string | Yes | Recipient phone number |
| message | string | Yes | SMS text |

```javascript
async function sendMessage() {
  try {
    const result = await smsClient.sendSMS({
      senderId: 'YourBrand',
      mobile: '+923001234567',
      message: 'Your verification OTP code is 987654.'
    });

    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}
```

Example response:

```json
{
  "status": "success",
  "message_id": "msg_f38d72b10a",
  "recipient": "+923001234567"
}
```

---

### 2. getBalance()

Retrieve account balance.

```javascript
async function checkBalance() {
  try {
    const balance = await smsClient.getBalance();
    console.log(balance);
  } catch (error) {
    console.error(error.message);
  }
}
```

Example response:

```json
{
  "status": "success",
  "balance": 24500,
  "currency": "PKR",
  "sms_remaining": 24500,
  "expiry_date": "2027-12-31"
}
```

---

### 3. getDeliveryStatus(messageId)

Track delivery status of a message.

| Parameter | Type | Required | Description |
|---|---|---|---|
| messageId | string | Yes | Message tracking ID |

```javascript
async function checkDelivery(id) {
  try {
    const status = await smsClient.getDeliveryStatus(id);
    console.log(status);
  } catch (error) {
    console.error(error.message);
  }
}

checkDelivery('msg_f38d72b10a');
```

Example response:

```json
{
  "status": "success",
  "message_id": "msg_f38d72b10a",
  "delivery_status": "delivered",
  "sent_time": "2026-05-18T11:20:00Z",
  "delivered_time": "2026-05-18T11:20:03Z"
}
```

---

## Error Handling

```javascript
try {
  await smsClient.sendSMS({
    senderId: '',
    mobile: '+923000000000',
    message: 'Diagnostic Validation String'
  });
} catch (error) {
  console.error('Intercepted Exception:', error.message);
}
```

---

## Security Best Practices

- Keep API keys in environment variables.
- Never expose credentials in frontend code.
- Use only in backend/server environments such as Node.js, Express, or Next.js API routes.

```env
SMS2CONNECT_API_KEY=your_secret_key
```

---

## License

MIT License
