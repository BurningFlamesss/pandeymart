# Welcome to PandeyMart Codebase

Welcome to the Switzerland of Ecommerce platform; Welcome to PandeyMart, a fullstack single tenant (has potential to turn into multi tenant) ecommerce platform with tons of exciting features. PandeyMart features a really clean and minimalistic design approach that most of the new ecommerce platform lacks. PandeyMart removes all the clutters and only focuses on the features that is actually needed. 

## Structure

No any application is perfect and PandeyMart is not an exception.

- .tanstack
- db
- node_modules
- prisma
- public
  - ads
  - banner
  - offers
  - sectionstarter (depreciated)
  - whychooseus
  - favicon.ico
  - manifest.json
  - pandeymart.png
  - robots.txt
- src
  -components
  - config
  - context
  - generated
  - helper
  - hooks
  - lib
  - middleware
  - provider
  - routes
    - _auth
    - admin
    - api
    - __root.tsx
    - index.tsx
  - schema
  - server
    - functions
    - payment
  - styles
  - types
  - utils
  - db.ts
  - logo.svg
  - router.tsx
  - start.ts
  - styles.css
- .env.example (should be converted to `.env.local`)
- package-lock.json
- package.json
- README.md

## Features

Although PandeyMart doesnot include any buzz features like AI/ML, or Blockchain, it has several features that makes it stand out of rest.

- Clean & Minimalistic Design
- Customizations of products, to choose between varieties & options
- Admin Panel for managing orders, products, and users
- Cart for managing the products via buyers in the client side of the website
- Favourite page for saving the products for future purchase intention
- Orders page for managing the orders made by the buyer
- Two way communication between Admin & Buyer via Seller Notes and Buyer Notes (Which can be changed)
- Review System for trust
- Functionality for Refund, Cancel and Reorder.
- Payment support for COD (Cash on delivery) and Esewa (Nepal's popular payment service)
- Powerful Address management system for auto filling frequent addresses
- and many more...

## Get started with contribution

Step 1: Clone
```bash
git clone https://github.com/BurningFlamesss/pandeymart
```

Step 2: Install deps
```bash
npm i
```

Step 3: Rename `.env.example` to `.env.local` and change the variables

Step 4: Setup prisma client and run following commands one after another
```bash
npm run db:generate
npm run db:push
npm run db:seed (If you have seeds)
npm run db:studio
```
Step 5: Run either the dev server or the production server
```bash
npm run dev
npm run build
```

Step 6: Once you have glimpse of the project and its code, you can contribute to make this good as gold.

## eSewa Test Credentials

eSewa ID: 9806800001/2/3/4/5 (e.g. 9806800001)
Password: Nepal@123
Token: 123456


## Disclaimer

The app currently might not support some features either due to reliance on third party services like vercel, neon, esewa, prisma, better auth, etc, or due to the issue not in my control. It doesnot mean that features arenot there. I inputted my best to make this thing to get live and add all the features as promised and also optimised it further more to resolve many errors including `"Transaction API error: Unable to start a transaction in the given time."` however the issue isnot yet 100% resolved. So, just try refreshing the app whenever app shows this error. 
Thanks for understanding :)
