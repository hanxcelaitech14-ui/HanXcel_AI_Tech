'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminServices() {
  return (
    <AdminCRUD
      title="Services"
      table="services"
      orderBy="sort_order"
      searchField="title"
      columns={[
        { key: 'icon', label: 'Icon' },
        { key: 'title', label: 'Title' },
        { key: 'is_featured', label: 'Featured', render: (val) => val ? '⭐' : '—' },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'title', label: 'Service Title', type: 'text', placeholder: 'Artificial Intelligence' },
        { key: 'icon', label: 'Icon (Emoji)', type: 'text', placeholder: '🤖' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Service description...' },
        { key: 'features', label: 'Features', type: 'tags', placeholder: 'Feature 1, Feature 2' },
        { key: 'is_featured', label: 'Featured Service', type: 'checkbox' },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
