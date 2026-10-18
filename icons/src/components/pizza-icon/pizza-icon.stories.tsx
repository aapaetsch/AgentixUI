// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PizzaIcon } from "./index";
const meta={title:"Icons/Nature/Pizza",component:PizzaIcon,args:{"aria-label":"Pizza"},tags:["autodocs"]} satisfies Meta<typeof PizzaIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PizzaIcon size="0.875rem" aria-label="Pizza 0.875rem"/><PizzaIcon size="1rem" aria-label="Pizza 1rem"/><PizzaIcon size="1.25rem" aria-label="Pizza 1.25rem"/><PizzaIcon size="1.5rem" aria-label="Pizza 1.5rem"/></div>};
