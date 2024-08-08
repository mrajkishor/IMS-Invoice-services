Below is the complete list of screens for MVP

### 1. **Login Screen**
- **Fields**: Email, Password
- **Buttons**: Login
- **API Call**: `/auth/login`
- **Response Handling**: Store JWT token on successful login

### 2. **Register Screen**
- **Fields**: Username, Email, Password
- **Buttons**: Register
- **API Call**: `/users`
- **Response Handling**: Show success message and navigate to login screen

### 3. **Home Screen**
- **Tabs**: Users, Shops, Invoices, History
- **Each tab will have specific functionalities as described below**

### 4. **Users Tab**
#### Create User
- **Fields**: Username, Email, Password
- **Buttons**: Create User
- **API Call**: `/users`
- **Response Handling**: Show success message

#### View User
- **Fields**: User ID (to be entered)
- **Buttons**: View User
- **API Call**: `/users/{userId}`
- **Response Handling**: Display user details

#### Update User
- **Fields**: User ID, Username, Email, Password
- **Buttons**: Update User
- **API Call**: `/users/{userId}`
- **Response Handling**: Show success message

#### Delete User
- **Fields**: User ID (to be entered)
- **Buttons**: Delete User
- **API Call**: `/users/{userId}`
- **Response Handling**: Show success message

### 5. **Shops Tab**
#### Create Shop
- **Fields**: Shop Name, Owner ID, Address
- **Buttons**: Create Shop
- **API Call**: `/shops`
- **Response Handling**: Show success message

#### View Shop
- **Fields**: Shop ID (to be entered)
- **Buttons**: View Shop
- **API Call**: `/shops/{shopId}`
- **Response Handling**: Display shop details

#### Update Shop
- **Fields**: Shop ID, Shop Name, Address
- **Buttons**: Update Shop
- **API Call**: `/shops/{shopId}`
- **Response Handling**: Show success message

#### Delete Shop
- **Fields**: Shop ID (to be entered)
- **Buttons**: Delete Shop
- **API Call**: `/shops/{shopId}`
- **Response Handling**: Show success message

### 6. **Invoices Tab**
#### Create Invoice
- **Fields**: Shop ID, Customer ID, Items (Item ID, Quantity, Price), Total Amount, Date
- **Buttons**: Create Invoice
- **API Call**: `/invoices`
- **Response Handling**: Show success message

#### View Invoice
- **Fields**: Invoice ID (to be entered)
- **Buttons**: View Invoice
- **API Call**: `/invoices/{invoiceId}`
- **Response Handling**: Display invoice details

#### Update Invoice
- **Fields**: Invoice ID, Items (Item ID, Quantity, Price), Total Amount, Date
- **Buttons**: Update Invoice
- **API Call**: `/invoices/{invoiceId}`
- **Response Handling**: Show success message

#### Delete Invoice
- **Fields**: Invoice ID (to be entered)
- **Buttons**: Delete Invoice
- **API Call**: `/invoices/{invoiceId}`
- **Response Handling**: Show success message

### 7. **History Tab**
#### View Shop History
- **Fields**: Shop ID (to be entered)
- **Buttons**: View History
- **API Call**: `/shops/{shopId}/history`
- **Response Handling**: Display history list
