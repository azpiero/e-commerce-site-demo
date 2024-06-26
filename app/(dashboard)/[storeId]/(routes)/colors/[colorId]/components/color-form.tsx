'use client';

import { useState } from 'react';
import { Color } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'Please enter a valid color value',
  }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormValuesProps {
  initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormValuesProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  });

  // これもすばらしい書き方
  const title = initialData ? 'Edit Color' : 'New Color';
  const description = initialData ? 'Edit your color' : 'Create a new color';
  const toastMassage = initialData ? 'Color updated' : 'Color created';
  const action = initialData ? 'Save Changes' : 'Create Color';

  const onSubmit = async (values: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values);
      }
      //mutateでなくrefreshすることで再取得できる
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast({
        title: 'Success',
        description: toastMassage,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update store settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast({
        title: 'Success',
        description: 'color deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete size',
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant='destructive'
            size='sm'
            onClick={() => {
              setOpen(true);
            }}
            disabled={loading}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='color name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-x-4'>
                      <Input disabled={loading} placeholder='color value' {...field} />
                      <div className='border p-4 rounded-full' style={{ backgroundColor: field.value }} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type='submit' className='ml-auto'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
