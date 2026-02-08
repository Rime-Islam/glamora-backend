# 🛠️ Glamora – E-Commerce Backend
## 📌 Project Overview

Glamora Backend is the server-side implementation of the Glamora e-commerce platform.
It provides secure, scalable, and high-performance APIs for user, vendor, and admin functionalities, including authentication, product management, orders, reviews, and payment integration.

The backend is built with Node.js and Express.js, using PostgreSQL with Prisma ORM, and integrates with third-party services such as Cloudinary for file storage and Aamarpay/SSLCommerz for payment processing.

# 🚀 Key Features
## 💳 Payment Integration

- Aamarpay sandbox for payments

- Optional SSLCommerz validation

- Supports coupon and discount handling during checkout

## 🔐 Security & Authentication

- JWT-based authentication and authorization

- Password hashing with bcrypt

- Role-based access control (Customer / Vendor / Admin)

- Environment-based secure configurations

## Routes
🛣️ API Routes & Descriptions
1. User Routes (/user)

| Method | Endpoint           | Auth Role                 | Description                              |
| ------ | ------------------ | ------------------------- | ---------------------------------------- |
| POST   | `/signup`          | None                      | Register a new user (Customer or Vendor) |
| GET    | `/`                | Admin                     | Get all users                            |
| PATCH  | `/block/:id`       | Admin                     | Block a specific user                    |
| PATCH  | `/update-password` | Admin / Vendor / Customer | Update logged-in user’s password         |
| PATCH  | `/delete/:id`      | Admin                     | Delete a specific user                   |
                  |

2. Auth Routes (/auth)

| Method | Endpoint           | Auth Role | Description                      |
| ------ | ------------------ | --------- | -------------------------------- |
| POST   | `/signin`          | None      | User login                       |
| POST   | `/forget-password` | None      | Send password reset email        |
| PATCH  | `/set-password`    | None      | Set new password via reset token |
| GET    | `/user`            | Customer  | Get Customer dashboard info      |
| GET    | `/admin`           | Admin     | Get Admin dashboard info         |
| GET    | `/vendor`          | Vendor    | Get Vendor dashboard info        |


3. Category Routes (/category)

| Method | Endpoint           | Auth Role | Description                   |
| ------ | ------------------ | --------- | ----------------------------- |
| POST   | `/create-category` | None      | Create a new product category |
| GET    | `/`                | None      | Get all categories            |
| PATCH  | `/:id`             | Admin     | Update a category             |
| DELETE | `/:id`             | Admin     | Delete a category             |

4. Shop Routes (/shop)

| Method | Endpoint               | Auth Role | Description                           |
| ------ | ---------------------- | --------- | ------------------------------------- |
| POST   | `/create-shop`         | Vendor    | Create a new shop                     |
| GET    | `/`                    | Vendor    | Get all shops of logged-in vendor     |
| GET    | `/get-all-shop`        | None      | Get all vendor shops                  |
| GET    | `/get-single-shop/:id` | None      | Get details of a specific shop        |
| GET    | `/:id`                 | Vendor    | Get a single shop of logged-in vendor |
| POST   | `/new-follow/:id`      | Customer  | Follow a vendor shop                  |
| DELETE | `/remove-follow/:id`   | Customer  | Unfollow a vendor shop                |
| PATCH  | `/block-shop/:id`      | Admin     | Block a vendor shop                   |

5. Product Routes (/product)

| Method | Endpoint         | Auth Role | Description                   |
| ------ | ---------------- | --------- | ----------------------------- |
| POST   | `/add-product`   | Vendor    | Add a new product             |
| POST   | `/clone-product` | Vendor    | Duplicate an existing product |
| GET    | `/`              | None      | Get all products              |
| POST   | `/flash-sale`    | None      | Add a product to flash sale   |
| GET    | `/:id`           | None      | Get single product details    |
| GET    | `/search`        | None      | Search products with filters  |
| PATCH  | `/:id`           | Vendor    | Update a product              |
| DELETE | `/:id`           | Vendor    | Delete a product              |

6. Order Routes (/order)

| Method | Endpoint            | Auth Role                 | Description                          |
| ------ | ------------------- | ------------------------- | ------------------------------------ |
| GET    | `/single-order/:id` | Admin / Vendor / Customer | Get a single order details           |
| GET    | `/my-order`         | Customer                  | Get all orders of logged-in customer |
| GET    | `/pending-order`    | Admin                     | Get all pending orders               |
| GET    | `/shop-order`       | Vendor                    | Get all orders for vendor’s shop     |
| POST   | `/make-payment`     | Customer                  | Create a new order / payment         |
| GET    | `/all-orders`       | Admin                     | Get all orders across platform       |
| PATCH  | `/update/:id`       | Admin                     | Update order status                  |

7. Payment Routes (/payment)

| Method | Endpoint        | Auth Role | Description                        |
| ------ | --------------- | --------- | ---------------------------------- |
| POST   | `/confirmation` | None      | Confirm a payment after processing |

8. Cupon Routes (/cupon)

| Method | Endpoint         | Auth Role         | Description                          |
| ------ | ---------------- | ----------------- | ------------------------------------ |
| POST   | `/create-cupon`  | Vendor            | Create a new discount cupon for shop |
| GET    | `/get-cupon/:id` | Vendor / Customer | Get all cupons of a specific shop    |

9. Rating Routes (/rating)

| Method | Endpoint              | Auth Role | Description                            |
| ------ | --------------------- | --------- | -------------------------------------- |
| POST   | `/add-rating`         | Customer  | Add a rating/review for a product      |
| GET    | `/get-rating-by-shop` | Vendor    | Get all ratings given to vendor’s shop |
| PATCH  | `/reply`              | Vendor    | Reply to a customer review             |



## 🧰 Technologies Used
- **Backend**

Node.js & Express.js

TypeScript (strongly recommended)

Prisma ORM with PostgreSQL

bcrypt for password hashing

JWT for authentication

Cloudinary for image storage

Axios for external API requests (payments)

Nodemailer for email-based notifications

UUID for unique identifiers

## ⚙️ Project Local Setup (Backend)
1️⃣ Clone the Repository
```
git clone https://github.com/your-username/glamora-backend.git
cd glamora-backend
```

2️⃣ Install Dependencies
```
npm install
# or
yarn install
```

3️⃣ Environment Variables Setup

Create a .env file in the project root:

```
DATABASE_URL=Your Credentials
PORT=Your Credentials
SALTROUNDS=Your Credentials

# JWT Configuration
JWT_SECRET=Your Credentials
JWT_ACCESS_EXPIRES_IN=Your Credentials
ACCESS_REFRESH_SECRET=Your Credentials

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=https://car-rental-reservation-psi.vercel.app

# Email (Nodemailer)
EMAIL_USER=Your Credentials
EMAIL_PASS=Your Credentials

# Payment Gateway (Aamarpay)
STORE_ID=Your Credentials
SIGNATURE_KEY=Your Credentials
PAYMENT_URL=https://sandbox.aamarpay.com/jsonpost.php
PAYMENT_TRANSACTION=https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php
```

## ⚠️ Security Note: Never commit .env with secrets to public repositories.

4️⃣ Run the Development Server
```
npm run dev
# or
yarn dev
```

Backend will start at:
```
http://localhost:5001
```

5️⃣ Prisma Setup

## If using Prisma ORM:
```
npx prisma generate      # Generate Prisma client
npx prisma migrate dev    # Apply database migrations
```

## 📦 Production Build
```
npm run build
npm start
```

## 📄 License

This project is created for learning and demonstration purposes.
You are free to use, modify, and distribute it as needed.

## ✨ Author

Rime Islam – Backend & Full-Stack Developer