'use client';
import AdminCRUD from '@/components/admin/AdminCRUD';

export default function AdminTestimonials() {
  return (
    <AdminCRUD
      title="Testimonials"
      table="testimonials"
      orderBy="sort_order"
      searchField="client_name"
      columns={[
        { key: 'client_name', label: 'Client' },
        { key: 'company', label: 'Company' },
        { key: 'rating', label: 'Rating', render: (val) => '★'.repeat(val as number) },
        { key: 'sort_order', label: 'Order' },
      ]}
      fields={[
        { key: 'client_name', label: 'Client Name', type: 'text', placeholder: 'John Doe' },
        { key: 'company', label: 'Company', type: 'text', placeholder: 'ABC Technologies' },
        { key: 'content', label: 'Testimonial', type: 'textarea', placeholder: 'Their feedback...' },
        { key: 'rating', label: 'Rating (1-5)', type: 'text', placeholder: '5' },
        { key: 'sort_order', label: 'Sort Order', type: 'text', placeholder: '1' },
      ]}
    />
  );
}
