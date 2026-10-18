// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CoffeeIcon } from "./index";
const meta={title:"Icons/Nature/Coffee",component:CoffeeIcon,args:{"aria-label":"Coffee"},tags:["autodocs"]} satisfies Meta<typeof CoffeeIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CoffeeIcon size="0.875rem" aria-label="Coffee 0.875rem"/><CoffeeIcon size="1rem" aria-label="Coffee 1rem"/><CoffeeIcon size="1.25rem" aria-label="Coffee 1.25rem"/><CoffeeIcon size="1.5rem" aria-label="Coffee 1.5rem"/></div>};
