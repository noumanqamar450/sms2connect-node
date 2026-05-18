# SMS2Connect Node.js SDK

A lightweight and secure Node.js SDK for sending SMS and OTP messages using the SMS2Connect API.

---

# Features

- Send transactional SMS
- OTP verification support
- Node.js SDK wrapper
- Next.js integration examples
- React integration guidance
- Secure backend implementation
- Async/await support
- Error handling support

---

# Installation

Install the official package using your preferred package manager.

```bash
npm install sms2connect-node

# or

yarn add sms2connect-node

# or

pnpm add sms2connect-node
```

---

# Getting Started

Initialize the SDK using your secret API key from the SMS2Connect dashboard.

## Basic Initialization

```javascript
const SMS2Connect = require('sms2connect-node');

const smsClient = new SMS2Connect(
  'YOUR_SMS2CONNECT_API_KEY'
);
```

---

# API Reference

## Method: `sendSMS(options)`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `senderId` | string | Yes | Approved sender masking / brand name |
| `mobile` | string | Yes | Recipient mobile number with country code |
| `message` | string | Yes | SMS or OTP message text |

---

# Example Usage

## Basic SMS Example

```javascript
const SMS2Connect = require('sms2connect-node');

const smsClient = new SMS2Connect(
  'YOUR_SMS2CONNECT_API_KEY'
);

async function sendSms() {
  try {
    const response = await smsClient.sendSMS({
      senderId: 'YourBrand',
      mobile: '+923001234567',
      message: 'Hello from SMS2Connect!'
    });

    console.log(response);

  } catch (error) {
    console.error(error.message);
  }
}

sendSms();
```

---

# Node.js Express Integration

## Install Dependencies

```bash
npm install express dotenv sms2connect-node
```

## Environment Variables

Create a `.env` file:

```env
SMS2CONNECT_API_KEY=your_secret_api_key
```

## `server.js`

```javascript
const express = require('express');
const SMS2Connect = require('sms2connect-node');

require('dotenv').config();

const app = express();

app.use(express.json());

const smsClient = new SMS2Connect(
  process.env.SMS2CONNECT_API_KEY
);

app.post('/api/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  const otp = Math.floor(
    100000 + Math.random() * 900000
  );

  try {
    const response = await smsClient.sendSMS({
      senderId: 'YourBrand',
      mobile: phoneNumber,
      message: `Your OTP code is ${otp}`
    });

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

# Next.js Integration

Never expose your API key inside client-side components.

---

## Option A — Server Actions

### Install Package

```bash
npm install sms2connect-node
```

### `app/actions/sms.ts`

```typescript
'use server';

import SMS2Connect from 'sms2connect-node';

const smsClient = new SMS2Connect(
  process.env.SMS2CONNECT_API_KEY!
);

export async function sendOtpAction(
  formData: FormData
) {
  const phoneNumber = formData.get('phone') as string;

  if (!phoneNumber) {
    return {
      success: false,
      error: 'Phone number is required'
    };
  }

  try {
    const result = await smsClient.sendSMS({
      senderId: 'YourBrand',
      mobile: phoneNumber,
      message: 'Your verification OTP is 987654.'
    });

    return {
      success: true,
      result
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

### `app/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { sendOtpAction } from './actions/sms';

export default function OtpPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setStatus('Sending...');

    const formData = new FormData(e.currentTarget);

    const response = await sendOtpAction(formData);

    if (response.success) {
      setStatus('OTP dispatched successfully!');
    } else {
      setStatus(`Failed: ${response.error}`);
    }
  };

  return (
    <div>
      <h2>Request Verification Code</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          name="phone"
          placeholder="+923001234567"
          required
        />

        <button type="submit">
          Send OTP
        </button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}
```

---

## Option B — Route Handlers

### `app/api/sms/route.ts`

```typescript
import { NextResponse } from 'next/server';
import SMS2Connect from 'sms2connect-node';

const smsClient = new SMS2Connect(
  process.env.SMS2CONNECT_API_KEY!
);

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();

    const data = await smsClient.sendSMS({
      senderId: 'YourBrand',
      mobile,
      message: 'Hello from Next.js!'
    });

    return NextResponse.json({
      success: true,
      data
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      {
        status: 500
      }
    );
  }
}
```

---

# React SPA Integration

Never expose your secret API key directly in React frontend code.

Always use a backend proxy.

## `SmsComponent.jsx`

```javascript
import React, { useState } from 'react';

export default function SmsComponent() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const triggerSmsBackend = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        'https://your-backend-api.com/api/send-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: phone
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Code sent!');
      }

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+923000000000"
      />

      <button
        onClick={triggerSmsBackend}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Send SMS'}
      </button>
    </div>
  );
}
```

---

# Error Handling

Always wrap SDK requests using `try/catch`.

```javascript
try {
  const response = await smsClient.sendSMS({
    senderId: 'InvalidSender',
    mobile: '+923000000000',
    message: 'Test message'
  });

} catch (error) {
  console.error(
    'SDK intercepted an issue:',
    error.message
  );
}
```

---

# Security Best Practices

## Keep Secrets Secure

❌ Incorrect

```env
NEXT_PUBLIC_SMS2CONNECT_API_KEY=secret
```

✅ Correct

```env
SMS2CONNECT_API_KEY=secret
```

---

# License

MIT License

---

# Support

For support and integrations, contact the SMS2Connect team.
