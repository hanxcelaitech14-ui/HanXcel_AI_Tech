'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminProducts() {
  return (
    <AdminCRUD
      title="Products"
      table="products"
      orderBy="sort_order"
      searchField="title"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'status', label: 'Status', render: (val) => <span className={`admin-badge ${val as string}`}>{(val as string)?.replace('_', ' ')}</span> },
        { key: 'technologies', label: 'Tech', render: (val) => (val as string[])?.slice(0, 3).join(', ') || '—' },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'title', label: 'Product Title', type: 'text', placeholder: 'Fleet Management Platform' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Product description...' },
        { key: 'image_url', label: 'Image', type: 'image', placeholder: 'Paste URL or upload from your laptop' },
        { key: 'features', label: 'Features', type: 'tags', placeholder: 'GPS Tracking, Route Optimization' },
        { key: 'technologies', label: 'Technologies', type: 'tags', placeholder: 'React, Node.js, AWS' },
        { key: 'status', label: 'Status', type: 'select', options: ['live', 'beta', 'coming_soon'] },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
