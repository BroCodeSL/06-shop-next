import { CartState } from "@/context";
import { ICartProduct, IShippingAddress } from "@/interfaces";

type CartActionType =
  | { type: '[CART] - Load cart from cookie | storage', payload: ICartProduct[] }
  | { type: '[CART] - Update products in cart', payload: ICartProduct[] }
  | { type: '[CART] - Change product cart quantity', payload: ICartProduct }
  | { type: '[CART] - Remove product in cart', payload: ICartProduct }
  | { type: '[CART] - Load address from cookies', payload: IShippingAddress }
  | { type: '[CART] - Update shipping address', payload: IShippingAddress }
  | {
      type: '[CART] - Update order summary',
      payload: {
        numberOfItems: number,
        subTotal: number,
        tax: number,
        total: number
      }
    }
  | { type: '[CART] - Order complete' }


export const cartReducer = (state: CartState, action: CartActionType): CartState => {
  switch (action.type) {
    case '[CART] - Load cart from cookie | storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload]
      };

    case '[CART] - Update products in cart':
      return {
        ...state,
        cart:  [...action.payload ]
      };

    case '[CART] - Change product cart quantity':
      return {
        ...state,
        cart: state.cart.map(product => {
          if ( product._id !== action.payload._id ) return product;
          if ( product.size !== action.payload.size ) return product;          
          return action.payload;
        })
      }
    
    case '[CART] - Remove product in cart':
      return {
        ...state,
        cart: state.cart.filter(
          (product) => !(
            product._id === action.payload._id &&
            product.size === action.payload.size
          )
        ),
      };
    
    case '[CART] - Update order summary':
      return {
        ...state,
        ...action.payload
      }
    
    case '[CART] - Load address from cookies':
      case '[CART] - Update shipping address':
      return {
        ...state,
        shippingAddress: action.payload
      };
    case '[CART] - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0
      }
  
    default:
      return state;
  }
};
