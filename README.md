# 🧾 IMS-Invoice-services

**IMS-Invoice-services** is a complete, cloud-native invoice management platform built with the vision of empowering micro and small businesses to create, manage, and share professional invoices across mobile and web platforms.

> 🔗 Live: [chalaan.com](https://chalaan.com)  
> 📱 Android App: [Google Play Store](https://play.google.com/store/apps/details?id=com.chalaan.invoice)  
> ☁️ Serverless | 🔒 Secure | 📲 Cross-platform | 🚀 Fast

---

## 🚀 What This Project Demonstrates

This project is a **real-world, full-stack SaaS** built with modern tooling and best practices:

- 🎯 **Problem-driven development**: Simplifying digital billing for shopkeepers  
- 🧱 **End-to-end architecture**: From mobile UI to serverless AWS infrastructure  
- 📦 **Modular codebase**: Clear separation of concerns for API, UI, and infra  
- 🧠 **Solo-built product**: Designed, coded, and deployed independently

---

## 🌍 Use Cases

- Generate GST-style invoices in seconds
- Share invoices via link (mobile + web)
- Real-time cloud sync with DynamoDB
- Edit/delete history and customer data
- Store branding and business info per shop

---

## 🧠 Architecture Diagram

```
[ React Native App / React Landing Page ]
                ⬇
          AWS API Gateway
                ⬇
          AWS Lambda (Java)
                ⬇
            DynamoDB
```

---

## 🧰 Tech Stack

| Layer        | Tech                                      |
|--------------|-------------------------------------------|
| Frontend     | React (Next.js), Tailwind, TypeScript     |
| Mobile App   | React Native (Android), WebView Renderer  |
| Backend      | Java, AWS Lambda, API Gateway             |
| Infra        | AWS SAM, CloudFormation                   |
| Database     | DynamoDB                                  |
| CI/CD        | GitHub Actions                            |

---

## 📁 Folder Structure

```
IMS-Invoice-services/
├── API Contracts/           # OpenAPI specs and API docs
├── Prototype/MobileApp/     # React Native source for mobile app
├── SAM_cloudformation/      # Backend Infra as Code (Java Lambda)
├── UI/                      # Landing page and marketing frontend
├── Pre-prod defects.txt     # Test and QA notes
├── README.md
```

---

## 🛠 Deployment

### 🔧 Backend
```bash
cd SAM_cloudformation
sam build && sam deploy --guided
```

### 💻 Frontend
```bash
cd UI/LandingPage/my-app
npm install && npm run dev
```

---

## ✨ Features

- ✅ Create invoice with customer + business data
- ✅ Upload shop logo and brand info
- ✅ View invoice from a permanent mobile/web link
- ✅ Serverless, scalable infrastructure
- ✅ Custom invoice templates
- ✅ Mobile-first design

---

## 🔒 Security

- JWT-based auth for invoice management
- Unique UUID links for public invoice views
- Role-based access planning for future versions

---

## 🧭 Full Inventory Management System

The system is being progressively modularized to support a full-fledged Inventory Management Platform, with planned extensions including:


### 📦 Inventory Module
- Add/Edit/Delete stock items
- Track quantities with alerts for low stock
- Batch and expiry tracking (for groceries/pharmacy)

### 🏪 Shop & Branch Management
- Multi-store setup with user-level access
- Role-based permissions (Owner, Manager, Staff)

### 🧾 Invoice & Billing
- Already live – generate and share invoices
- Add custom templates and tax settings
- Auto-generate invoice numbers

### 💰 Purchase & Vendor Management
- Log purchases from suppliers
- Maintain vendor list and history
- Calculate cost of goods sold (COGS)

### 📊 Analytics & Reports
- Daily/weekly/monthly sales reports
- Top-selling items and customer trends
- Export to CSV/PDF

### 🧑‍🤝‍🧑 Customer Module
- Add customers with mobile/email
- Loyalty points (future add-on)
- View customer purchase history

### 🔐 Authentication & Access Control
- JWT-based login
- Role and permission management
- Planned: Admin portal and shop dashboard

---

## 🧪 Testing

- Manual testing via UAT checklist in `Pre-prod defects.txt`
- OpenAPI contracts ensure consistent request/response shapes
- Future roadmap includes Jest & Postman tests

---

## 💡 Vision & Next Steps

- 💳 Add payment QR & tracking per invoice
- 📊 Analytics for shopkeeper dashboard
- 🔄 Recurring billing support
- 🧾 PDF export & print styling
- 🌐 Multi-language UI support

---

## 🙋‍♂️ Author & Credits

Built and maintained by [Raj Kishor Maharana](https://github.com/mrajkishor)  
Open to ideas, improvements, and collaborators 💬

---

## 📄 License

This project is private but open for demo, inspiration, or extension under request. Contact via GitHub or LinkedIn or mrajkishor331@gmail.com.
