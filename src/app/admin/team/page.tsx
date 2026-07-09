'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminTeam() {
  return (
    <AdminCRUD
      title="Team Members"
      table="team_members"
      orderBy="sort_order"
      searchField="name"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
        { key: 'role', label: 'Role / Title', type: 'text', placeholder: 'CTO' },
        { key: 'photo_url', label: 'Photo', type: 'image', placeholder: 'Paste URL or upload from your laptop' },
        { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Short biography...' },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
