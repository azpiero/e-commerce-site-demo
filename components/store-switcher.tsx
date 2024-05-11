'use client';

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Store } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useStoreModal } from '@/hooks/use-store-modal';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from '@/components/ui/command';
import { CommandItem } from 'cmdk';

// propsの型定義 popOverTriggerから継承　refを除いたもの
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;
interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = items.find((item) => item.id === params.storeId);
  const [open, setOpen] = useState(false);
  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    console.log('STORE:', store);
    router.push(`/${store.value}`);
  };

  console.log('currentStore:', currentStore);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/** TODO aria-expandedの意味 */}
        <Button
          variant='outline'
          size='sm'
          role='combobox'
          aria-label='Select a store'
          aria-expanded={open}
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className='mr-2 h-4 w-4' />
          {currentStore?.name || 'Select a store'}
          {/** TODO shrink-0の意味とは */}
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>NO store found.</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className='text-sm flex items-center cursor-pointer'
                >
                  <StoreIcon className='mr-2 h-4 w-4' />
                  {store.label}
                  <Check
                    className={cn('ml-auto h-4 w-4', currentStore?.id === store.value ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
                className='flex items-center'
              >
                <PlusCircle className='mr-2 h-5 w-5' />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
