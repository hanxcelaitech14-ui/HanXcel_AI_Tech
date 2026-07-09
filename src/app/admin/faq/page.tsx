'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminFAQ() {
  return (
    <AdminCRUD
      title="FAQs"
      table="faqs"
      orderBy="sort_order"
      searchField="question"
      columns={[
        { key: 'question', label: 'Question' },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'question', label: 'Question', type: 'text', placeholder: 'What services do you provide?' },
        { key: 'answer', label: 'Answer', type: 'textarea', placeholder: 'We provide...' },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
