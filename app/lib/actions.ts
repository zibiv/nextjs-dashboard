'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),//изменить тип данных на число и проверить его
  status: z.enum(['pending', 'paid']),
  date: z.string(),
})

//указать что опускаем два поля из схемы
const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const path = '/dashboard/invoices'
  const rawFormData = Object.fromEntries(formData.entries())


    //валидировать данные
    const {customerId, amount, status} = CreateInvoice.parse(rawFormData)
    //изменить и добавить данны
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]
    //добавить данные в БД
    await sql`INSERT INTO invoices(customer_id, amount, status, date) VALUES(${customerId}, ${amountInCents}, ${status}, ${date})`

    revalidatePath(path);
    redirect(path)

 
}