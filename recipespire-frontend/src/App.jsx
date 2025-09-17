import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import RecipeList from './pages/Recipes/RecipeList';
import RecipeDetail from './pages/Recipes/RecipeDetail';
import RecipeForm from './pages/Recipes/RecipeForm';
import IngredientList from './pages/Ingredients/IngredientList';
import IngredientForm from './pages/Ingredients/IngredientForm';
import InventoryList from './pages/Inventory/InventoryList';
import InventoryForm from './pages/Inventory/InventoryForm';
import Toast from './components/UI/Toast';
import { useToast } from './hooks/useToast';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/recipes" element={<RecipeList />} />
          <Route path="/recipes/new" element={<RecipeForm />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/recipes/:id/edit" element={<RecipeForm />} />
          <Route path="/ingredients" element={<IngredientList />} />
          <Route path="/ingredients/new" element={<IngredientForm />} />
          <Route path="/ingredients/:id/edit" element={<IngredientForm />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/inventory/new" element={<InventoryForm />} />
          <Route path="/inventory/:id/edit" element={<InventoryForm />} />
        </Routes>
      </Layout>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Router>
  );
}

export default App;