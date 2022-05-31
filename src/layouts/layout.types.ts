import { ReactNode } from "react";

interface LayoutTypes {
   children: ReactNode;
};
interface SettingsPageLayoutProps {
   title?: string;
}

export type PublicLayoutTypes = LayoutTypes;
export type ShopAdminLayoutTypes = LayoutTypes;
export type InfoPageLayoutTypes = LayoutTypes;
export type SettingsPageLayoutTypes = LayoutTypes & SettingsPageLayoutProps;
