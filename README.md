# CozyNest

CozyNest is a full-stack web application that enables users to list, discover, and review rental properties and accommodations. Inspired by platforms like Airbnb, CozyNest provides an intuitive interface for property owners to create listings and for guests to browse, review, and book stays.

<p align="center">
  <img src="https://github.com/user-attachments/assets/33c3c25d-1ae2-4869-a05e-110d1b18ab3e" alt="Screenshot 2025-06-08 171915" width="600"/>
</p>

> **Live Demo:** [cozynest-1.onrender.com/listings](cozynest-1.onrender.com/listings) <!-- Replace with your actual live link -->

## Features

- **User Authentication:** Secure signup and login using Passport.js with session management.
- **Listing Management:** Owners can create, edit, and delete property listings, each with images, location, price, and descriptions.
- **Image Uploads:** Seamless image storage via Cloudinary.
- **Reviews and Ratings:** Authenticated users can leave reviews and ratings for listings.
- **Authorization:** Only logged-in users can create listings/reviews; only owners can edit or delete their listings.
- **Flash Messaging:** Feedback for successful actions and errors using connect-flash.
- **Form Validation:** Robust server-side validation for listings and reviews.
- **Responsive UI:** EJS templating with Bootstrap for a clean, mobile-friendly design.
- **Error Handling:** Custom error pages and handling for invalid routes.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** EJS, Bootstrap, Custom CSS
- **Authentication:** Passport.js, express-session, connect-mongo
- **Image Uploads:** Cloudinary, multer
- **Validation:** Joi
- **Other:** dotenv, method-override, connect-flash

## Getting Started

### Prerequisites

- Node.js >= 14.x
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for image uploads

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NSVPavan/CozyNest.git
   cd CozyNest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the project root with the following:
   ```
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the application:**
   ```bash
   npm start
   ```
   The server runs on [http://localhost:8080](http://localhost:8080).

## Folder Structure

```
.
├── controllers/        # Route handler logic (listings, reviews, users)
├── models/             # Mongoose schemas (Listing, Review, User)
├── routes/             # Express routers
├── views/              # EJS templates
├── public/             # Static files (CSS, JS, images)
├── utils/              # Utility modules (error handling, async wrappers)
├── middleware.js       # Custom Express middleware
├── cloudinary_config.js
├── index.js            # Entry point
└── README.md
```

## Usage

- **List Properties:** Browse all available listings on the home page.
- **Create/Edit/Delete Listings:** Sign up and log in to add or manage your own properties.
- **Review Listings:** Leave feedback and ratings for places you’ve stayed.
- **Image Uploads:** Attach images to listings for better visibility.
- **Session Handling:** Stay logged in and receive helpful flash messages.

## Security & Validation

- All sensitive operations require authentication.
- Only listing owners can modify their listings.
- Input data is validated using JOI schemas.
- Sessions are securely stored in MongoDB and cookies are HTTP-only.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)
- [Cloudinary](https://cloudinary.com/)
- [Bootstrap](https://getbootstrap.com/)

---
*Happy nesting!*
