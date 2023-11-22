'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "такого пользователя не существует. обратитесь в поддержку",
    required_error: "выберите клиента"
  }),
  amount: z.coerce.number({ //изменить тип данных на число и проверить его
    required_error: "введите сумму счета"
  }).gt(0, {message: "Введите сумму больше 0"}), 
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: "неверный статус платежа",
    required_error: "выберите статус платежа"
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    db?: string[];
  };
  message?: string | null;
};

//указать что опускаем два поля из схемы
const Invoice = InvoiceSchema.omit({ id: true, date: true });

export async function createInvoice(state: State, formData: FormData) {
  console.log()
  const path = '/dashboard/invoices';
  const rawFormData = Object.fromEntries(formData.entries());
  console.log(JSON.stringify(rawFormData))
  //валидировать данные
  const validatedFields = Invoice.safeParse(rawFormData);

  if(!validatedFields.success) {
    console.log("VALIDATION ERROR: ", validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'В вашем запросе пропущенные поля. Неудачное создание счета.'
    }
  }

  const { customerId, amount, status } = validatedFields.data
  //изменить и добавить данны
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    //добавить данные в БД
    await sql`INSERT INTO invoices(customer_id, amount, status, date) VALUES(${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    return { message: 'Database Error: база данных не отвечает, попробуйте позже.', errors: { db: ['Database Error: база данных не отвечает, попробуйте позже.'] }};
  }

  revalidatePath(path);
  redirect(path);
}

export async function updateInvoice(id: string, state: State, formData: FormData) {
  const path = '/dashboard/invoices';
  const rawFormData = Object.fromEntries(formData.entries());

  // const { customerId, amount, status } = Invoice.parse(rawFormData);
  const validatedFields = Invoice.safeParse(rawFormData);

  if(!validatedFields.success) {
    console.log("VALIDATION ERROR: ", validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'В вашем запросе пропущенные поля или не верно заполненные поля. Неудачное создание счета.'
    }
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  
  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}`;
  } catch (error) {
    console.log(error);
    return { errors: { db : ["Ошибка добавления счета к выбранному пользователю. Обратитесь в поддержку."]} , message: 'Ошибка добавления счета к выбранному пользователю. Обратитесь в поддержку.'};
  }
  revalidatePath(path);
  // revalidatePath(`/dashboard/invoices/${id}`);
  redirect(path);
}

export async function deleteInvoice(id: string) {
  const path = '/dashboard/invoices';
  
  try {
    await sql`
    DELETE FROM invoices
    WHERE id = ${id}`;
    return { message: `${id} invoice had deleted.` };
  } catch (error) {
    console.log(error);
    return { message: 'Database Error: Failed to Delete Invoice' };
  } finally {
    revalidatePath(path);
  }

  
      // revalidatePath(`/dashboard/invoices/${id}`);
}
