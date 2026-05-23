export default function AdminBlogPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Manage Blog Posts</h1>
        <button className="btn-primary btn-sm">+ New Post</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8 text-center text-secondary-500">
        <p>Blog management UI coming soon. Use the API at <code>/api/admin/blog</code></p>
      </div>
    </div>
  );
}
