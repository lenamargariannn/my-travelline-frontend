export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Manage Categories</h1>
        <button className="btn-primary btn-sm">+ Add Category</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8 text-center text-secondary-500">
        <p>Category management coming soon. Use the API at <code>/api/admin/categories</code></p>
      </div>
    </div>
  );
}
