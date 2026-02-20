// Simulating 2 tenants: nike & apple

export const dummyTenants = {
  nike: {
    users: [
      {
        id: 1,
        name: "Nike Owner",
        email: "owner@test.com",
        role: "Owner",
        active: true
      },
      {
        id: 2,
        name: "Nike Manager",
        email: "manager@test.com",
        role: "Manager",
        active: true
      },
      {
        id: 3,
        name: "Nike Staff",
        email: "staff@test.com",
        role: "Staff",
        active: true
      }
    ],

    suppliers: [
      {
        id: 1,
        name: "Asia Textile Ltd",
        contact: "asia@textile.com"
      },
      {
        id: 2,
        name: "Shoe Factory Co",
        contact: "factory@shoe.com"
      }
    ],

    products: [
      {
        id: 1,
        name: "T-Shirt",
        category: "Apparel",
        variants: [
          {
            sku: "TS-RED-M",
            color: "Red",
            size: "M",
            price: 20,
            stock: 10,
            threshold: 5
          },
          {
            sku: "TS-BLUE-L",
            color: "Blue",
            size: "L",
            price: 22,
            stock: 3,
            threshold: 5
          }
        ]
      },
      {
        id: 2,
        name: "Running Shoes",
        category: "Footwear",
        variants: [
          {
            sku: "SH-BLK-42",
            color: "Black",
            size: "42",
            price: 120,
            stock: 5,
            threshold: 3
          },
          {
            sku: "SH-WHT-41",
            color: "White",
            size: "41",
            price: 115,
            stock: 2,
            threshold: 3
          }
        ]
      }
    ],

    orders: [
      {
        id: 101,
        customer: "John Doe",
        status: "Confirmed",
        items: [
          { sku: "TS-RED-M", quantity: 2, price: 20 },
          { sku: "SH-BLK-42", quantity: 1, price: 120 }
        ],
        total: 160,
        createdAt: "2026-02-15"
      }
    ],

    purchaseOrders: [
      {
        id: 201,
        supplierId: 1,
        status: "Confirmed",
        items: [
          { sku: "TS-BLUE-L", quantity: 20, cost: 15 }
        ],
        expectedDate: "2026-02-25"
      }
    ],

    stockMovements: [
      {
        id: 1,
        sku: "TS-RED-M",
        type: "SALE",
        quantity: -2,
        date: "2026-02-15"
      },
      {
        id: 2,
        sku: "TS-BLUE-L",
        type: "PURCHASE",
        quantity: 20,
        date: "2026-02-10"
      }
    ]
  },

  apple: {
    users: [
      {
        id: 1,
        name: "Apple Owner",
        email: "owner@test.com",
        role: "Owner",
        active: true
      }
    ],

    suppliers: [
      {
        id: 1,
        name: "Foxconn",
        contact: "foxconn@apple.com"
      }
    ],

    products: [
      {
        id: 1,
        name: "iPhone 15",
        category: "Electronics",
        variants: [
          {
            sku: "IP15-BLK-128",
            color: "Black",
            size: "128GB",
            price: 999,
            stock: 15,
            threshold: 5
          },
          {
            sku: "IP15-BLU-256",
            color: "Blue",
            size: "256GB",
            price: 1099,
            stock: 4,
            threshold: 5
          }
        ]
      }
    ],

    orders: [],

    purchaseOrders: [],

    stockMovements: []
  }
};
