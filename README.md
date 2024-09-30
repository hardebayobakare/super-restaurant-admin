# Full Stack Restaurant Admin Dashboard: Next.js 14 App Router, TailwindCSS, React, Prisma, MySQL, 2024


This is a repository for a Full Stack Restaurant Admin Dashboard: Next.js 14 App Router, TailwindCSS, React, Prisma, MySQL


Key Features:


- UI/UX: Shadcn UI [Shadcn UI Docs](https://ui.shadcn.com/docs), Recharts [Recharts Docs](https://recharts.org/en-US)
- Authentication: Clerk Authentication [Clerk Authentication](https://clerk.com/)
- Database: PostGres hosted on [Vercel](https://vercel.com/)
- Object Relational Mapping (ORM): Prisma [Prisma DOcs](https://www.prisma.io/docs)
- The admin dashboard serves as Content management system (CMS), frontend API, and Admin panel
- Able to create, update and delete produts!
- Able to create, update and delete categories!
- Able to upload multiple images for products and update whenever required
- Able to create, update and delete filters such as "Size", and then match them in the "Product" creation form.
- Able to Search through all categories, products, sizes, billboards with included pagination!
- Able to control which products are "featured" so they show on the homepage!


### Prerequisites
**Node version 20.x**

Setup:

### Install Packages
```shell
npm i
```

### Setup .env file
``` js
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

DATABASE_URL=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

STRIPE_API_KEY=

STRIPE_WEBHOOK_SECRET=
```

### Connect to Database (PlanetScale and Push Prisma)
```shell
npx prisma generate
npx prisma db push
```

### Start the App
```shell
npm run dev
```