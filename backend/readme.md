# LocalLink API Documentation

This API provides functionality for businesses to connect, collaborate, and transact with each other. It includes authentication, business profiles, products/services, orders, messaging, connections, and reviews.

## Table of Contents
- [Authentication](#authentication)
- [Business Profiles](#business-profiles)
- [Products/Services](#productsservices)
- [Orders](#orders)
- [Connections](#connections)
- [Messaging](#messaging)
- [Reviews](#reviews)
- [Notifications](#notifications)

---

## Authentication

### Register a Business
`POST /auth/register`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "business_name": "string",
  "business_type": "string",
  "location": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "email": "string",
    "business_name": "string",
    "business_type": "string",
    "location": "string"
  }
}
```

### Login
`POST /auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "email": "string",
    "business_name": "string"
  }
}
```

---

## Business Profiles

### Get Business Profile
`GET /business/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "string",
  "email": "string",
  "business_name": "string",
  "business_type": "string",
  "location": "string",
  "logo": {
    "public_id": "string",
    "url": "string"
  },
  "images": [
    {
      "public_id": "string",
      "url": "string",
      "altText": "string"
    }
  ]
}
```

### Update Business Profile
`PUT /business/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "business_name": "string",
  "business_type": "string",
  "location": "string",
  "description": "string"
}
```

**Response:** Updated business profile

### Upload Business Logo
`POST /business/:id/logo`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
logo: <image file>
```

**Response:** Updated business profile with new logo

### Upload Business Images
`POST /business/:id/images`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
images: <array of image files> (max 5)
```

**Response:** Updated business profile with new images

### Search Businesses
`GET /business/`

**Query Parameters:**
- `business_type`: string
- `location`: string
- `search`: string (searches business_name and description)

**Response:**
```json
[
  {
    "_id": "string",
    "business_name": "string",
    "business_type": "string",
    "location": "string",
    "rating": number
  }
]
```

---

## Products/Services

### Create Product/Service
`POST /product/`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "business_id": "string",
  "location": "string"
}
```

**Response:** Created product

### Get Products by Business
`GET /product/business/:businessId`

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": number,
    "category": "string",
    "mainImage": {
      "public_id": "string",
      "url": "string"
    },
    "gallery": [
      {
        "public_id": "string",
        "url": "string",
        "altText": "string"
      }
    ]
  }
]
```

### Update Product
`PUT /product/:productId`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string"
}
```

**Response:** Updated product

### Search Products
`GET /product/search`

**Query Parameters:**
- `category`: string
- `min_price`: number
- `max_price`: number
- `location`: string
- `search`: string (searches name and description)

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": number,
    "category": "string",
    "business_id": {
      "_id": "string",
      "business_name": "string"
    }
  }
]
```

### Upload Product Main Image
`POST /product/:id/mainImage`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
image: <image file>
```

**Response:** Updated product with new main image

### Upload Product Gallery Images
`POST /product/:id/gallery`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
images: <array of image files> (max 5)
```

**Response:**
```json
{
  "gallery": [
    {
      "public_id": "string",
      "url": "string",
      "altText": "string"
    }
  ]
}
```

---

## Orders

### Create Order
`POST /order/`

**Request Body:**
```json
{
  "product_id": "string",
  "supplier_id": "string",
  "buyer_id": "string",
  "quantity": number,
  "total_price": number,
  "status": "string"
}
```

**Response:** Created order

### Update Order Status
`PUT /order/:id/status`

**Request Body:**
```json
{
  "status": "string",
  "verification_code": "string"
}
```

**Response:** Updated order

### Get Orders by Business
`GET /order/business/:businessId`

**Query Parameters:**
- `type`: "buyer" or "supplier"

**Response:**
```json
[
  {
    "_id": "string",
    "product_id": {
      "_id": "string",
      "name": "string"
    },
    "supplier_id": {
      "_id": "string",
      "business_name": "string"
    },
    "buyer_id": {
      "_id": "string",
      "business_name": "string"
    },
    "quantity": number,
    "total_price": number,
    "status": "string"
  }
]
```

---

## Connections

### Create Connection Request
`POST /connection/`

**Request Body:**
```json
{
  "business1_id": "string",
  "business2_id": "string"
}
```

**Response:** Created connection

### Update Connection Status
`PUT /connection/:id`

**Request Body:**
```json
{
  "status": "string" // "accepted", "rejected", "pending"
}
```

**Response:** Updated connection

### Get Business Connections
`GET /connection/business/:businessId`

**Query Parameters:**
- `status`: "accepted", "rejected", or "pending"

**Response:**
```json
[
  {
    "_id": "string",
    "business1_id": {
      "_id": "string",
      "business_name": "string"
    },
    "business2_id": {
      "_id": "string",
      "business_name": "string"
    },
    "status": "string"
  }
]
```

---

## Messaging

### Send Message
`POST /message/`

**Request Body:**
```json
{
  "sender_id": "string",
  "receiver_id": "string",
  "content": "string"
}
```

**Response:** Created message

### Get Conversation
`GET /message/conversation`

**Query Parameters:**
- `business1`: string (business ID)
- `business2`: string (business ID)

**Response:**
```json
[
  {
    "_id": "string",
    "sender_id": "string",
    "receiver_id": "string",
    "content": "string",
    "created_at": "date"
  }
]
```

---

## Reviews

### Create Review
`POST /review/`

**Request Body:**
```json
{
  "business_id": "string",
  "reviewer_id": "string",
  "rating": number,
  "comment": "string"
}
```

**Response:** Created review

### Get Business Reviews
`GET /review/business/:businessId`

**Response:**
```json
[
  {
    "_id": "string",
    "reviewer_id": {
      "_id": "string",
      "business_name": "string"
    },
    "rating": number,
    "comment": "string"
  }
]
```

---

## Notifications

### Get Business Notifications
`GET /notification/business/:businessId`

**Query Parameters:**
- `read`: boolean

**Response:**
```json
[
  {
    "_id": "string",
    "type": "string",
    "message": "string",
    "read": boolean,
    "created_at": "date",
    "metadata": {
      "order_id": "string",
      "connection_id": "string",
      "message_id": "string"
    }
  }
]
```

### Mark Notification as Read
`PUT /notification/:id/read`

**Response:**
```json
{
  "_id": "string",
  "read": true
}
```

---

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Errors include a message in the response body:
```json
{
  "error": "string"
}
```