'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), //изменить тип данных на число и проверить его
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

//указать что опускаем два поля из схемы
const Invoice = InvoiceSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const path = '/dashboard/invoices';
  const rawFormData = Object.fromEntries(formData.entries());

  //валидировать данные
  const { customerId, amount, status } = Invoice.parse(rawFormData);
  //изменить и добавить данны
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  //добавить данные в БД
  await sql`INSERT INTO invoices(customer_id, amount, status, date) VALUES(${customerId}, ${amountInCents}, ${status}, ${date})`;

  revalidatePath(path);
  redirect(path);
}

export async function updateInvoice(id: string, formData: FormData) {
  const path = '/dashboard/invoices';
  const rawFormData = Object.fromEntries(formData.entries());

  const { customerId, amount, status } = Invoice.parse(rawFormData);
  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}`;

  revalidatePath(path);
  // revalidatePath(`/dashboard/invoices/${id}`);
  redirect(path);
}

export async function deleteInvoice(id: string) {
  const path = '/dashboard/invoices';

  await sql`
    DELETE FROM invoices
    WHERE id = ${id}`;

  revalidatePath(path);
  // revalidatePath(`/dashboard/invoices/${id}`);
}
