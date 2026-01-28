<!-- BACKEND DEPENDCY  -->
 npm i express mongoose nodemon bcryptjs cors dotenv jsonwebtoken cookie-parser validator



📝 Signup Flow (Short Notes)

1️⃣ Frontend → POST /api/auth/registration (Registration.jsx)
 Sends: name, email, password

2️⃣ index.js
 Loads routes + connects DB

3️⃣ authRoutes.js
 POST /registration → calls registration()

4️⃣ authController.js
 - Read input
 - Check user exists
 - Validate email
 - Validate password
 - Hash password
 - Create user in DB
 - Generate JWT token
 - Store token in cookie
 - Return user

5️⃣ userModel.js
 Defines user fields: name, email, password, cartData

6️⃣ token.js
 Creates JWT token (valid 7 days)

7️⃣ db.js
 Connects to MongoDB using URL

⭐ Flow in ONE LINE

Frontend → Route → Controller → Model → Token → Cookie → Response





to make any :-

Model -> Conroller -> Routes ->index.js






Registered Name :-
Razorpay Payments Private Limited

CIN :- 
U62099KA2024PTC188982


Use this personalised link to accept payments instantly from your customers :- 
razorpay.me/@raman7998