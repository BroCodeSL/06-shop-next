import { FC, useCallback, useEffect, useMemo, useReducer } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import { ICartProduct, IOrder, ISession, IShippingAddress } from "@/interfaces";
import { CartContext, cartReducer } from "@/context";
import { shopApi } from "@/api";
import { useSession } from "next-auth/react";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: IShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);
  const { data: session } = useSession();

  useEffect(() => {
    try {
      const cookieProducts = Cookies.get('cart') ? JSON.parse( Cookies.get('cart')! ): [];
      dispatch({ type: '[CART] - Load cart from cookie | storage', payload: cookieProducts });
    } catch (error) {
      dispatch({ type: '[CART] - Load cart from cookie | storage', payload: [] });
    }
  }, []);

  useEffect(() => {

    if (Cookies.get('shippingAddress')) {
      const cookieAddress = (Cookies.get('shippingAddress') ? JSON.parse( Cookies.get('shippingAddress')! ): {
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        zip: '',
        city: '',
        country: '',
        phone: '',
      }) as IShippingAddress;
      dispatch({ type: '[CART] - Load address from cookies', payload: cookieAddress });
    }
  }, []);

  useEffect(() => {
    if (!!state.cart.length) {
      Cookies.set('cart', JSON.stringify( state.cart ));
    }
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev , 0);
    const subTotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

  
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1)
    }

    dispatch({ type: '[CART] - Update order summary', payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = useCallback(
    (product: ICartProduct) => {
      const productInCart = state.cart.some((p) => p._id === product._id);
      if (!productInCart) {
        return dispatch({
          type: "[CART] - Update products in cart",
          payload: [...state.cart, product],
        });
      }
      const productInCartButDifferentSize = state.cart.some(
        (p) => p._id === product._id && p.size === product.size
      );
      if (!productInCartButDifferentSize) {
        return dispatch({
          type: "[CART] - Update products in cart",
          payload: [...state.cart, product],
        });
      }

      // Accumulate
      const updatedProducts = state.cart.map( p => {
        if (p._id !== product._id) return p;
        if (p.size !== product.size) return p;

        p.quantity += product.quantity;

        return p;
      });
      dispatch({ type: '[CART] - Update products in cart', payload: updatedProducts })
    },
    [state.cart],
  )

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: '[CART] - Change product cart quantity',
      payload: product
    })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({
      type: '[CART] - Remove product in cart',
      payload: product
    })
  }

  const updateShippingAddress = ( address: IShippingAddress ) => {
    Cookies.set( 'shippingAddress', JSON.stringify(address) );
    dispatch({ type: '[CART] - Update shipping address', payload: address});
  }

  const createOrder = useCallback(
    async () => {
      if (  !state.shippingAddress) {
        throw new Error('There is no delivery address');
      }
  
      const body: IOrder & ISession = {
        orderItems: state.cart.map(p => ({
          ...p,
          size: p.size!
        })),
        shippingAddress: state.shippingAddress,
        numberOfItems: state.numberOfItems,
        subTotal: state.subTotal,
        tax: state.tax,
        total: state.total,
        isPaid: false,
        user: session?.user as any
      }
  
      try {
        const { data } = await shopApi.post<IOrder>('/orders', body);
  
        dispatch({ type: '[CART] - Order complete' });
        return {
          hasError: false,
          message: data._id!
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return {
            hasError: true,
            message: error.response?.data.message
          }
        }
        return {
          hasError: true,
          message: 'Unhandled error talk to administrator'
        }
      }
    },
    [session?.user, state],
  );

  const providerValue = useMemo(
    () => ({
      ...state,

      // Methods
      addProductToCart,
      removeCartProduct,
      updateCartQuantity,
      updateShippingAddress,

      // Orders
      createOrder
    }),
    [addProductToCart, createOrder, state]
  );

  return (
    <CartContext.Provider value={providerValue}>{children}</CartContext.Provider>
  );
};
