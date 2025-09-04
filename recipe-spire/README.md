# RecipeSpire Frontend

A modern Angular frontend for the RecipeSpire recipe management system, built with Tailwind CSS and connected to a Spring Boot backend.

## Features

- **Dashboard**: Overview of recipes, ingredients, and inventory with quick stats
- **Recipe Management**: Create, view, edit, and delete recipes with ingredients
- **Ingredient Management**: Manage your ingredient database with categories and units
- **Inventory Tracking**: Track stock levels, expiration dates, and storage locations
- **Search & Filter**: Find recipes and ingredients quickly
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Prerequisites

- Node.js 18+ and npm
- Angular CLI (`npm install -g @angular/cli`)
- RecipeSpire Backend running on `http://localhost:8080`

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   ng serve
   ```

3. **Open your browser:**
   Navigate to `http://localhost:4200`

## Backend Configuration

The frontend is configured to connect to the Spring Boot backend at `http://localhost:8080/api`.

If your backend runs on a different URL, update the `apiBaseUrl` in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## Project Structure

```
src/app/
├── core/
│   └── services/           # API services (recipe, ingredient, inventory)
├── shared/
│   ├── models/            # TypeScript interfaces matching backend DTOs
│   ├── components/        # Reusable components (toast, confirm-dialog, etc.)
│   └── services/          # Shared services (toast)
├── features/
│   ├── dashboard/         # Dashboard overview
│   ├── recipes/           # Recipe management
│   ├── ingredients/       # Ingredient management
│   └── inventory/         # Inventory tracking
├── app.routes.ts          # Application routing
└── app.module.ts          # Main module
```

## API Endpoints

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

- **Angular 17+** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing
- **Angular Forms** - Reactive forms with validation

## Development

### Running Tests
```bash
ng test
```

### Building for Production
```bash
ng build --prod
```

### Code Formatting
The project uses Angular's built-in linting and formatting. Run:
```bash
ng lint
```

## Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Write unit tests for new features
4. Follow the existing component structure
5. Use Tailwind CSS classes for styling

## Troubleshooting

### Backend Connection Issues
- Ensure the Spring Boot backend is running on `http://localhost:8080`
- Check CORS configuration in the backend
- Verify API endpoints match the backend implementation

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Angular cache: `ng cache clean`

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that all Tailwind classes are available
- Verify PostCSS configuration