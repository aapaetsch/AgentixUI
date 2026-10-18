// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CreditCardIcon } from "./index";
const meta={title:"Icons/Commerce/Credit Card",component:CreditCardIcon,args:{"aria-label":"Credit Card"},tags:["autodocs"]} satisfies Meta<typeof CreditCardIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CreditCardIcon size="0.875rem" aria-label="Credit Card 0.875rem"/><CreditCardIcon size="1rem" aria-label="Credit Card 1rem"/><CreditCardIcon size="1.25rem" aria-label="Credit Card 1.25rem"/><CreditCardIcon size="1.5rem" aria-label="Credit Card 1.5rem"/></div>};
