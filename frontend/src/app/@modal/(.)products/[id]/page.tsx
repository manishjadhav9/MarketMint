'use client';

import { useParams } from 'next/navigation';
import Modal from '@/components/ui/modal';
import ProductDetailsView from '@/components/ProductDetailsView';

export default function PhotoModal() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Modal>
      <ProductDetailsView productId={id} />
    </Modal>
  );
}
