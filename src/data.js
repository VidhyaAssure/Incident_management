// src/data.js
export const customers = [
  {
    id: 1,
    name: "Acme Corp",
    vendorGroups: [
      {
        id: 1,
        name: "Vendor Group 1",
        phones: ["+918825683746", "+919843314780"],
        emails: ["vidhyabharathy65255@gmail.com", "secops@acme.com"],
      },
      {
        id: 2,
        name: "Vendor Group 2",
        phones: ["+447911123456"],
        emails: ["team1@acme.com", "secops@acme.com"],
      }
    ]
  },
  {
    id: 2,
    name: "Beta Inc",
    vendorGroups: [
      {
        id: 1,
        name: "Vendor Group 1",
        phones: ["+14151234567", "+919876543210"],
        emails: ["team1@beta.com", "secops1@beta.com"],
      },
      {
        id: 2,
        name: "Vendor Group 2",
       phones: ["+14151234567", "+919876543210"],
       emails: ["team2@beta.com", "secops2@beta.com"],
      },
      {
        id: 3,
        name: "Vendor Group 3",
        phones: ["+14151234567", "+919876543210"],
        emails: ["team3@beta.com", "secops3@beta.com"],
      }
    ]
  }
];
