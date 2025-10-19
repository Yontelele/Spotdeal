![Logo Banner](./docs/logo_banner.png)

<div align="center">

# Spotdeal – Telecom Subscription Sales Platform

![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)
![Project](https://img.shields.io/badge/Project-Complete-success)
![.NET](https://img.shields.io/badge/.NET-512BD4?logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?logo=c-sharp&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoft-sql-server&logoColor=white)
![Azure](https://img.shields.io/badge/Azure-0078D4?logo=microsoft-azure&logoColor=white)

> **NOTICE:** This is a portfolio project. Commercial use is strictly prohibited. See [LICENSE](LICENSE) for details.

</div>

## About the Project

Spotdeal helps telecom retailers find, compare, and sell the right mobile subscription in seconds, without switching between operator sites and spreadsheets. By gathering operator pricing, campaigns, and phone discounts in one workspace, sales staff can focus on the customer, not the calculation. Every order is tracked in real-time dashboards showing performance, budget progress, and sales trends.

## Features

### 🔐 Authentication & Security

- Azure AD authentication via MSAL (Microsoft Authentication Library)
- User validation against SQL database for access control
- JWT Bearer token authorization for all API requests
- Role-based access control with user levels (Sales, Manager, Admin)

### 🏢 Multi-tenancy

- Designed for large retail chains with multiple stores
- Data isolation at both company level and store level
- Automatic data filtering based on user context

### 🛠️ Tech & Infrastructure

- **Frontend:** React (TypeScript, TailwindCSS, Vite)
- **Backend:** ASP.NET Core, Entity Framework
- **Database:** Microsoft SQL Server
- **Hosting:** Azure App Service & Azure SQL

### 🚀 Core Functionality

- Track sales progress and staff performance in real-time
- Compare subscription pricing and discounts across all operators
- Register sales through guided step-by-step workflow
- View complete order history and cancel registrations when needed

## Screenshots

<details>
<summary>📊 <b>Dashboard</b></summary>

<br>

### Sales Overview

![Sales Overview](./docs/sales_overview.jpg)

> _Sales progress by operator, daily trends, and recent orders_

---

### Individual Performance Table

![Individual Performance Table](./docs/performance_table.png)

> _Sales staff performance with daily stats and goal progress_

---

</details>

<details>
<summary>📱 <b>Sales Registration</b></summary>

<br>

### Step 1: Select Operator

![Select Operator](./docs/select_operator.png)

> _Choose operator to start sale registration_

---

### Step 2: Select Subscription

![Select Subscription](./docs/select_subscription.png)

> _Select subscription plan and review order summary_

---

### Step 3: Add Phone

![Add Phone](./docs/add_phone.png)

> _Search and select phone model_

---

### Step 4: Choose Phone

![Choose Phone](./docs/choose_phone_color.png)

> _Pick phone color and continue to next step_

---

### Step 5: Add to Cart

![Add to Cart](./docs/add_phone_to_cart.png)

> _Set discount and payment method, then add phone to order_

---

### Step 6: Confirm Sale

![Confirm Sale](./docs/confirm_sale.png)

> _Review order details, copy codes, and register the sale_

---

### Step 7: Sale Confirmation

![Sale Confirmation](./docs/sale_confirmation.png)

> _Order successfully registered with confirmation number_

---

</details>

<details>
<summary>🔍 <b>Price Comparison</b></summary>

<br>

### Pricing Table

![Pricing Table](./docs/pricing_table.png)

> _Quick reference table with subscription prices, discounts, and campaigns_

---

</details>

<details>
<summary>📦 <b>Order Management</b></summary>

<br>

### Order History

![Order History](./docs/order_history.png)

> _All registered orders with details and option to cancel_

---

### Cancel Order

![Cancel Order](./docs/cancel_order.png)

> _Select subscriptions to cancel, provide reason, and confirm cancellation_

---

</details>

## License

Licensed under **CC BY-NC-ND 4.0** – shared for educational and portfolio purposes.

You may view and study the code, but commercial use, modifications, and redistribution are not permitted. <br/> See [LICENSE](LICENSE) for complete terms.

---

<div align="center">

_Copyright © 2025 Jonathan Larsson_

</div>
