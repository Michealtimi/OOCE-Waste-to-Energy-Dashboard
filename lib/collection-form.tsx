'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Zod schema for form validation
const formSchema = z.object({
  items: z
    .array(
      z.object({
        type: z.enum(['bottle', 'crate', 'pet']),
        quantity: z.coerce.number().min(1, 'Min 1'),
        condition: z.enum(['good', 'damaged', 'crushed']),
      })
    )
    .min(1, 'Please add at least one item.'),
  incentivePaid: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type CollectionFormValues = z.infer<typeof formSchema>;

// A simple reusable button component
const Button = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      'bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export function CollectionForm() {
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ type: 'bottle', quantity: 1, condition: 'good' }],
      incentivePaid: 0,
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit = async (data: CollectionFormValues) => {
    setStatusMessage({ type: 'info', text: 'Submitting...' });
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setStatusMessage({ type: 'success', text: 'Collection logged successfully!' });
      form.reset();
    } else {
      const errorData = await response.json();
      setStatusMessage({ type: 'error', text: `Error: ${errorData.message || 'Something went wrong.'}` });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-6">
      {/* Item Rows */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Collected Items</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start p-3 border rounded-lg">
            <div className="col-span-3 grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select {...form.register(`items.${index}.type`)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10 px-3">
                  <option value="bottle">Bottle</option>
                  <option value="crate">Crate</option>
                  <option value="pet">PET</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input type="number" {...form.register(`items.${index}.quantity`)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10 px-3" />
                {form.formState.errors.items?.[index]?.quantity && <p className="text-xs text-red-500 mt-1">{form.formState.errors.items?.[index]?.quantity?.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Condition</label>
                <select {...form.register(`items.${index}.condition`)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10 px-3">
                  <option value="good">Good</option>
                  <option value="damaged">Damaged</option>
                  <option value="crushed">Crushed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end h-full mt-2 md:mt-0">
              <Button type="button" variant="ghost" onClick={() => remove(index)} className="bg-transparent text-red-500 hover:bg-red-100" disabled={fields.length <= 1}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <Button type="button" onClick={() => append({ type: 'bottle', quantity: 1, condition: 'good' })} className="w-full bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
      </Button>

      {/* Incentive Paid Input */}
      <div>
        <label htmlFor="incentivePaid" className="block text-sm font-medium text-gray-700">
          Incentive Paid (e.g., ₦)
        </label>
        <input type="number" {...form.register('incentivePaid')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10 px-3" placeholder="0" />
        {form.formState.errors.incentivePaid && <p className="text-xs text-red-500 mt-1">{form.formState.errors.incentivePaid?.message}</p>}
      </div>

      {/* Notes Textarea */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea {...form.register('notes')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? 'Submitting...' : 'Log Collection'}
      </Button>

      {/* Submission Message */}
      {statusMessage.text && (
        <p className={cn('text-sm', {
            'text-green-600': statusMessage.type === 'success',
            'text-red-600': statusMessage.type === 'error',
            'text-blue-600': statusMessage.type === 'info',
          })}
        >
          {statusMessage.text}
        </p>
      )}
    </form>
  );
}