import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';

import { formatter } from '@/lib/utils';
import { ProductClient } from './components/product-client';
import { ProductColumn } from './components/columns';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    // decimal to currency
    price: formatter.format(product.price.toNumber()),
    size: product.size.name,
    color: product.color.name,
    category: product.category.name,
    createdAt: format(product.createdAt, 'MMMM do, yyyyy'),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
