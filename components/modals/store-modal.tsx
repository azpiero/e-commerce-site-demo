'use clinet';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

import { useStoreModal } from '@/hooks/use-store-modal';
import { Modal } from '@/components/ui/modal';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/stores', values);
      /**
       * window.location.assign は単なるブラウザのリダイレクトであり、新しいURLに移動するだけですが、=> refresh page => 必ずページ(db)を読み込む
       * next/navigation の router.push はNext.jsのルーターを介してページ遷移を行い、SPAの特性やサーバーサイドレンダリングの利点を活かすことができます。
       */
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create store',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={storeModal.isOpen} onClose={storeModal.onClose} title='test' description='test'>
      <div className='space-y-4 px-2 pb-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    {/** spreadすることでonChangeなどに関与しないことを示す */}
                    <Input disabled={loading} placeholder='E-commarce' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='pt-6 space-x-2 flex items-center justify-end'>
              <Button disabled={loading} variant='outline' onClick={storeModal.onClose}>
                Cancel
              </Button>
              <Button disabled={loading} type='submit'>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
