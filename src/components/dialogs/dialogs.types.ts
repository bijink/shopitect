export interface ProductDeleteProps {
   shopUrlName: string,
   prodId: string,
}

export interface ProductEditProps {
   shopUrlName: string;

   prodId: string;
   prodName: string;
   prodCodeName: string;
   prodBrand: string;
   prodCategory: string;
   quantity: number;
   getPrice: number;
   sellPrice: number;
   profitAmount: number;
   profitPercentage: number;
};

export interface LogoutConfirmProps {
   handleMenuClose: () => void;
}
