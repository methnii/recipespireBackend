# RecipeSpire Frontend

A modern React frontend for the RecipeSpire recipe management system, built with Vite, Tailwind CSS, and connected to a Spring Boot backend.

## Features

- **Dashboard**: Overview of recipes, ingredients, and inventory with quick stats
- **Recipe Management**: Create, view, edit, and delete recipes with ingredients
- **Ingredient Management**: Manage your ingredient database with categories and units
- **Inventory Tracking**: Track stock levels, expiration dates, and storage locations
- **Search & Filter**: Find recipes and ingredients quickly
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Form Validation**: Robust form validation with React Hook Form and Yup

## Prerequisites

- Node.js 18+ and npm
- RecipeSpire Backend running on `http://localhost:8080`

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Backend Configuration

The frontend is configured to connect to the Spring Boot backend at `http://localhost:8080/api`.

If your backend runs on a different URL, update the `API_BASE_URL` in `src/services/api.js`.

## Project Structure

```
src/
├── components/
│   ├── Layout/           # Layout components (Header, Layout)
│   └── UI/              # Reusable UI components (Toast, ConfirmDialog, etc.)
├── hooks/               # Custom React hooks
├── pages/               # Page components organized by feature
│   ├── Dashboard.jsx    # Dashboard overview
│   ├── Recipes/         # Recipe management pages
│   ├── Ingredients/     # Ingredient management pages
│   └── Inventory/       # Inventory management pages
├── services/            # API service functions
├── App.jsx             # Main app component with routing
└── main.jsx            # App entry point
```

## API Integration

The frontend connects to these backend endpoints:

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/{id}` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/{id}` - Update recipe
- `DELETE /api/recipes/{id}` - Delete recipe
- `GET /api/recipes/search?query={query}` - Search recipes
- `GET /api/recipes/category/{category}` - Get recipes by category

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/{id}` - Get ingredient by ID
- `POST /api/ingredients/single` - Create single ingredient
- `POST /api/ingredients/bulk` - Create multiple ingredients
- `PUT /api/ingredients/{id}` - Update ingredient
- `DELETE /api/ingredients/{id}` - Delete ingredient

### Inventory
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/low-stock` - Get low stock items
- `POST /api/inventory` - Add to inventory
- `PUT /api/inventory/{id}` - Update inventory item
- `DELETE /api/inventory/{id}` - Remove from inventory

## Technologies Used

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Yup** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Features Overview

### Dashboard
- Quick stats overview
- Recent recipes display
- Low stock alerts
- Quick action buttons

### Recipe Management
- Create, edit, and delete recipes
- Add multiple ingredients with quantities
- Search and filter by category
- Detailed recipe view with ingredients and instructions

### Ingredient Management
- Manage ingredient database
- Categorize ingredients
- Set units of measurement
- Track calories per unit

### Inventory Management
- Track ingredient stock levels
- Set minimum stock levels for alerts
- Monitor expiration dates
- Organize by storage location

## Contributing

1. Follow React best practices
2. Use TypeScript for new components (optional)
3. Write clean, readable code
4. Use Tailwind CSS for styling
5. Test your changes thoroughly

## Troubleshooting

### Backend Connection Issues
- Ensure the Spring Boot backend is running on `http://localhost:8080`
- Check CORS configuration in the backend
- Verify API endpoints match the backend implementation

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `npx vite --force`

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that all Tailwind classes are available
- Verify PostCSS configuration