'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminChatbot() {
  return (
    <AdminCRUD
      title="Chatbot AI Knowledge Base"
      table="chatbot_context"
      orderBy="created_at"
      searchField="title"
      columns={[
        { key: 'title', label: 'Topic / Title' },
        { key: 'content', label: 'Knowledge Content', render: (val) => (val as string)?.slice(0, 100) + '...' },
        { key: 'created_at', label: 'Created At', render: (val) => new Date(val as string).toLocaleDateString() },
      ]}
      fields={[
        { key: 'title', label: 'Topic Title', type: 'text', placeholder: 'e.g. Service Offerings, pricing info...' },
        { key: 'content', label: 'Knowledge / Context Details', type: 'textarea', placeholder: 'Insert company details for the AI chatbot to learn from...' },
      ]}
    />
  );
}
