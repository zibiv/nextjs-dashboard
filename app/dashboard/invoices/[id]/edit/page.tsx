import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import EditInvoiceForm from '@/app/ui/invoices/edit-form';
import { notFound  } from 'next/navigation';
import { FC } from 'react';

interface UpdateInvoiceProps {
  params: {
    id: string;
  };
}

const UpdateInvoice: FC<UpdateInvoiceProps> = async ({ params: { id } }) => {
  //получить данные о счете
  //получить данные о пользователях
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);
  //проверить наличие данных
  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </main>
  );
};

export default UpdateInvoice;
