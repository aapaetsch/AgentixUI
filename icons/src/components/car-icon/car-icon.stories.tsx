// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { CarIcon } from "./index";
const meta={title:"Icons/Commerce/Car",component:CarIcon,args:{"aria-label":"Car"},tags:["autodocs"]} satisfies Meta<typeof CarIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><CarIcon size="0.875rem" aria-label="Car 0.875rem"/><CarIcon size="1rem" aria-label="Car 1rem"/><CarIcon size="1.25rem" aria-label="Car 1.25rem"/><CarIcon size="1.5rem" aria-label="Car 1.5rem"/></div>};
