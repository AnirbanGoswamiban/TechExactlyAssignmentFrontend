# Multi Tenant Inventory and Order Management System

This project is a full stack multi tenant inventory and order management
system designed for real world business use cases. It supports multiple
tenants or businesses with complete data isolation, role based access
control, and transaction safe stock management.

------------------------------------------------------------------------

## Core Highlights

-   Multi tenant backend architecture\
-   Tenant based database isolation\
-   Role based authentication and authorization\
-   Transaction safe inventory management\
-   Dynamic tenant switching via URL\
-   Business ready scalable design

------------------------------------------------------------------------

## Multi Tenant Architecture

This system is built using a multi tenant backend model where:

-   Each tenant or business has its own isolated database\
-   A middleware dynamically selects the tenant database based on
    request context\
-   This ensures full data isolation, high scalability, and strict
    business separation

------------------------------------------------------------------------

## Tenant Selection via URL

Tenants are switched dynamically using URL routing:

https://tech-exactly-assignment-frontend.vercel.app/{tenant}/login

Example:

/ekart/login\
/dkart/login

This allows seamless switching between different businesses without
redeploying the backend.

------------------------------------------------------------------------

## Tenant Login Examples

### DKart Tenant Login
https://tech-exactly-assignment-frontend.vercel.app/dkart/login

``` json
{
  "email": "abc@gmail.com",
  "password": "123abc",
  "name": "abc"
}
```

### EKart Tenant Login
https://tech-exactly-assignment-frontend.vercel.app/ekart/login

``` json
{
  "email": "abc@gmail.com",
  "password": "abc123",
  "name": "abc"
}
```

Each tenant has separate authentication databases and credentials
ensuring zero data leakage.

------------------------------------------------------------------------

## Role Based Access Control

The system supports role based UI and API access.

### Supported Roles

-   Owner\
-   Manager

Each role has:

-   Different UI access\
-   Different backend permissions\
-   Secure route level protection

### Example Access

Owner\
Full access including users, inventory, and orders

Manager\
Limited access including inventory and orders

------------------------------------------------------------------------

## Secure Authentication Flow

-   JWT based authentication\
-   Role based authorization middleware\
-   Tenant aware authentication pipeline\
-   Secure login and session handling

------------------------------------------------------------------------

## Transaction Based Stock Management

To prevent race conditions and data corruption, MongoDB transactions are
used.

When receiving a purchase order:

-   Purchase order update\
-   Stock increase\
-   Inventory transaction logging

All operations run inside a single database transaction ensuring atomic
operations, rollback safety, and data integrity.

------------------------------------------------------------------------

## Inventory Flow Logic

Purchase order created\
No stock change

Purchase order received\
Stock increases

Sales order created\
Stock decreases

Return order\
Stock increases

Adjustment\
Manual stock change

------------------------------------------------------------------------

## Frontend Features

-   Tenant based routing\
-   Role based UI rendering\
-   Protected routes\
-   Dynamic dashboard per tenant\
-   Real time inventory updates

------------------------------------------------------------------------

## Business Oriented Design

This system is built to support:

-   Multi store businesses\
-   Franchise based operations\
-   SaaS inventory platforms\
-   ERP style modular expansion

------------------------------------------------------------------------

## Tech Stack

### Backend

-   Node.js\
-   Express.js\
-   MongoDB\
-   Mongoose\
-   JWT Authentication\
-   MongoDB Transactions

### Frontend

-   React\
-   React Router\
-   Role based route protection\
-   Modular UI architecture

------------------------------------------------------------------------

## Security and Isolation

-   Full database level isolation per tenant\
-   Strict request based tenant resolution\
-   Zero shared collections\
-   Role restricted API endpoints

------------------------------------------------------------------------

## System Advantages

-   Highly scalable\
-   Enterprise grade data isolation\
-   Multi business ready\
-   Transaction safe operations\
-   Real world business workflows

------------------------------------------------------------------------

## Future Enhancements

-   Warehouse based stock separation\
-   Audit logs and inventory ledger\
-   Multi location tenant support\
-   Advanced reporting dashboard\
-   Notification system

------------------------------------------------------------------------

## Author

Built and designed by BANE\
Multi tenant SaaS grade backend architecture

------------------------------------------------------------------------