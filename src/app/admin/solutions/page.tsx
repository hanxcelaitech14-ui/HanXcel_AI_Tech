'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminSolutions() {
  return (
    <AdminCRUD
      title="Solutions"
      table="solutions"
      orderBy="sort_order"
      searchField="title"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'industry', label: 'Industry' },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'title', label: 'Solution Title', type: 'text', placeholder: 'Healthcare AI' },
        { key: 'industry', label: 'Industry', type: 'text', placeholder: 'Healthcare' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Solution description...' },
        { key: 'image_url', label: 'Image', type: 'image', placeholder: 'Paste URL or upload from your laptop' },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
