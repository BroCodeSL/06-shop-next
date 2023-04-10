import { createContext } from 'react';

import { ICartProduct, IShippingAddress } from '@/interfaces';

type ContextProps = {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: IShippingAddress;

  // Methods
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateShippingAddress: (address: IShippingAddress) => void;

  // Orders
  createOrder: () => Promise<{ hasError: boolean; message: string;}>;
}

export const CartContext = createContext({} as ContextProps);