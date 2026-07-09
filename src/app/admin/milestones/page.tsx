'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminMilestones() {
  return (
    <AdminCRUD
      title="Milestones"
      table="milestones"
      orderBy="sort_order"
      searchField="title"
      columns={[
        { key: 'year', label: 'Year' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'year', label: 'Year', type: 'text', placeholder: '2024' },
        { key: 'title', label: 'Achievement Title', type: 'text', placeholder: 'Major Milestone' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the achievement...' },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
