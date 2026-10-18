// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { TruckIcon } from "./index";
const meta={title:"Icons/Commerce/Truck",component:TruckIcon,args:{"aria-label":"Truck"},tags:["autodocs"]} satisfies Meta<typeof TruckIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><TruckIcon size="0.875rem" aria-label="Truck 0.875rem"/><TruckIcon size="1rem" aria-label="Truck 1rem"/><TruckIcon size="1.25rem" aria-label="Truck 1.25rem"/><TruckIcon size="1.5rem" aria-label="Truck 1.5rem"/></div>};
