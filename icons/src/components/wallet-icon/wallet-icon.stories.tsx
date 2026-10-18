// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { WalletIcon } from "./index";
const meta={title:"Icons/Commerce/Wallet",component:WalletIcon,args:{"aria-label":"Wallet"},tags:["autodocs"]} satisfies Meta<typeof WalletIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><WalletIcon size="0.875rem" aria-label="Wallet 0.875rem"/><WalletIcon size="1rem" aria-label="Wallet 1rem"/><WalletIcon size="1.25rem" aria-label="Wallet 1.25rem"/><WalletIcon size="1.5rem" aria-label="Wallet 1.5rem"/></div>};
