import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Package, ShoppingCart, AlertTriangle, Plus, TrendingUp } from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { ingredientService } from '../services/ingredientService';
import { inventoryService } from '../services/inventoryService';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalIngredients: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load recipes
      const recipesResponse = await recipeService.getAllRecipes();
      const recipes = recipesResponse.data;
      setStats(prev => ({ ...prev, totalRecipes: recipes.length }));
      setRecentRecipes(recipes.slice(-5).reverse());

      // Load ingredients
      const ingredientsResponse = await ingredientService.getAllIngredients();
      setStats(prev => ({ ...prev, totalIngredients: ingredientsResponse.data.length }));

      // Load inventory
      const inventoryResponse = await inventoryService.getAllInventoryItems();
      const inventoryItems = inventoryResponse.data;
      const lowStock = inventoryItems.filter(item => item.status === 'LOW_STOCK');
      const outOfStock = inventoryItems.filter(item => item.status === 'OUT_OF_STOCK');
      
      setStats(prev => ({
        ...prev,
        lowStockItems: lowStock.length,
        outOfStockItems: outOfStock.length,
      }));

      // Load low stock items for display
      const lowStockResponse = await inventoryService.getLowStockItems();
      setLowStockItems(lowStockResponse.data.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      title: 'Total Recipes',
      value: stats.totalRecipes,
      icon: ChefHat,
      color: 'bg-blue-500',
      link: '/recipes',
    },
    {
      title: 'Ingredients',
      value: stats.totalIngredients,
      icon: Package,
      color: 'bg-green-500',
      link: '/ingredients',
    },
    {
      title: 'Low Stock',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      link: '/inventory',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockItems,
      icon: ShoppingCart,
      color: 'bg-red-500',
      link: '/inventory',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to RecipeSpire</h1>
        <p className="mt-2 text-gray-600">Manage your recipes, ingredients, and inventory all in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions and Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/recipes/new"
              className="w-full btn-primary flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Recipe
            </Link>
            <Link
              to="/ingredients/new"
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Ingredient
            </Link>
            <Link
              to="/inventory/new"
              className="w-full btn-secondary flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Inventory
            </Link>
          </div>
        </div>

        {/* Recent Recipes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Recipes</h3>
            <Link
              to="/recipes"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentRecipes.length > 0 ? (
              recentRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipes/${recipe.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{recipe.title}</p>
                    <p className="text-sm text-gray-500">{recipe.category || 'Uncategorized'}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No recipes yet
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
            <Link
              to="/inventory"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.ingredient.name}</p>
                    <p className="text-sm text-yellow-700">
                      {item.quantity} {item.ingredient.unit} remaining
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Low Stock
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                All items in stock
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;