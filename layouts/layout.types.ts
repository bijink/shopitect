import { ReactNode } from "react";

export interface PageLayoutProps {
   children: ReactNode;
   navbar: JSX.Element;
   sidebar?: JSX.Element;
   btmNavbar?: JSX.Element;
   title?: string;
};
