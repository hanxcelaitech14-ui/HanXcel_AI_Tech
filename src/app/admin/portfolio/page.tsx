'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminPortfolio() {
  return (
    <AdminCRUD
      title="Portfolio Projects"
      table="portfolio"
      orderBy="sort_order"
      searchField="title"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'client', label: 'Client' },
        { key: 'category', label: 'Category', render: (val) => <span className="admin-badge published">{(val as string)?.toUpperCase()}</span> },
        { key: 'technology', label: 'Tech', render: (val) => (val as string[])?.join(', ') || '—' },
      ]}
      fields={[
        { key: 'title', label: 'Project Title', type: 'text', placeholder: 'Project name' },
        { key: 'client', label: 'Client', type: 'text', placeholder: 'Client name' },
        { key: 'category', label: 'Category', type: 'select', options: ['ai', 'web', 'mobile', 'iot'] },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Project description...' },
        { key: 'image_url', label: 'Image', type: 'image', placeholder: 'Paste URL or upload from your laptop' },
        { key: 'technology', label: 'Technologies', type: 'tags', placeholder: 'React, Node.js, AWS' },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
