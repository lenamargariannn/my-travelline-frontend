export default function AdminGalleryPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">Manage Gallery</h1>
        <button className="btn-primary btn-sm">+ Upload Images</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8 text-center text-secondary-500">
        <p>Gallery management UI coming soon. Use the API at <code>/api/admin/gallery</code></p>
      </div>
    </div>
  );
}
