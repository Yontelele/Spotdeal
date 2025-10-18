![Logo Banner](./docs/logo_banner.png)

<div align="center">

# Spotdeal – Telecom Subscription Sales Platform

![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)
![Status: Portfolio](https://img.shields.io/badge/Status-Portfolio-blue)
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
Spotdeal helps telecom sales staff find, compare, and sell the right mobile subscription in seconds, without switching between operator sites and spreadsheets. By gathering operator pricing, campaigns, and phone discounts in one workspace, salespeople can focus on the customer, not the calculation. Every order is tracked in real-time dashboards showing performance, budget progress, and sales trends.

## Key Features

- **Multi-Operator Comparison** – Instantly compare subscription plans, pricing, and campaigns across all telecom operators in one unified view
- **Intelligent Phone Catalog** – Search and filter phone models with real-time discount calculations, color availability, and payment options
- **Guided Sales Workflow** – Step-by-step registration process that ensures complete and accurate order information every time
- **Real-Time Performance Dashboard** – Live sales tracking with individual metrics, daily trends, and visual budget progress indicators
- **Team Analytics** – Comprehensive performance tables showing each representative's activity, conversion rates, and goal achievement
- **Complete Order Management** – Full order history with detailed breakdowns and flexible cancellation workflow with reason tracking
- **Dynamic Pricing Reference** – Quick-access pricing table serving as instant reference for all operators, active campaigns, and current promotions

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

> _Sales rep performance with daily stats and goal progress_

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

## Technical Implementation

Spotdeal is built as a full-stack application using ASP.NET Core for the backend API and React with TypeScript for the frontend interface. The system follows Clean Architecture principles with clearly separated layers for presentation, business logic, and data access, making the codebase maintainable, testable, and scalable.

The backend exposes a RESTful API built with ASP.NET Core Web API, utilizing Entity Framework Core for database operations. The data layer implements optimized queries with proper indexing and eager loading strategies to handle concurrent sales operations efficiently. Authentication is managed through JWT tokens, ensuring secure API access with role-based authorization for different user types.

The frontend leverages React's component-based architecture with TypeScript for enhanced type safety and developer experience. State management is handled through React Context API combined with custom hooks, providing a clean approach to sharing state across components. The interface is styled with TailwindCSS utility classes, enabling rapid development while maintaining a consistent design system optimized for tablet devices commonly used in retail environments. The application implements responsive design patterns, lazy loading for optimal performance, and comprehensive form validation to ensure data integrity throughout the sales process.

## License

Licensed under **CC BY-NC-ND 4.0** – shared for educational and portfolio purposes.

You may view and study the code, but commercial use, modifications, and redistribution are not permitted. <br/> See [LICENSE](LICENSE) for complete terms.
