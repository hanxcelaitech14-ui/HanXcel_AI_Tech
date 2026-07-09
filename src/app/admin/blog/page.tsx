'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminBlog() {
  return (
    <AdminCRUD
      title="Blog Posts"
      table="blog_posts"
      orderBy="created_at"
      searchField="title"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        {
          key: 'published',
          label: 'Status',
          render: (val) =>
            val ? (
              <span className="admin-badge published">Published</span>
            ) : (
              <span className="admin-badge draft">Draft</span>
            ),
        },
        {
          key: 'published_at',
          label: 'Date',
          render: (val) =>
            val ? new Date(val as string).toLocaleDateString() : '—',
        },
      ]}
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Post title' },
        { key: 'slug', label: 'Slug', type: 'text', placeholder: 'post-url-slug' },
        { key: 'cover_image', label: 'Cover Image', type: 'image', placeholder: 'Paste URL or upload from your laptop' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'Short description...' },
        { key: 'content', label: 'Content (Markdown)', type: 'textarea', placeholder: '## Heading\n\nYour content...' },
        { key: 'seo_title', label: 'SEO Title', type: 'text', placeholder: 'SEO optimized title' },
        { key: 'seo_description', label: 'SEO Description', type: 'textarea', placeholder: 'Meta description' },
        { key: 'published', label: 'Published', type: 'checkbox' },
      ]}
    />
  );
}
