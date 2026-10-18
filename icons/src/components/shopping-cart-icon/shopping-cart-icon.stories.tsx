// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ShoppingCartIcon } from "./index";
const meta={title:"Icons/Commerce/Shopping Cart",component:ShoppingCartIcon,args:{"aria-label":"Shopping Cart"},tags:["autodocs"]} satisfies Meta<typeof ShoppingCartIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ShoppingCartIcon size="0.875rem" aria-label="Shopping Cart 0.875rem"/><ShoppingCartIcon size="1rem" aria-label="Shopping Cart 1rem"/><ShoppingCartIcon size="1.25rem" aria-label="Shopping Cart 1.25rem"/><ShoppingCartIcon size="1.5rem" aria-label="Shopping Cart 1.5rem"/></div>};
