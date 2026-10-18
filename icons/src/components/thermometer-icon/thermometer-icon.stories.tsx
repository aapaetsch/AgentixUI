// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ThermometerIcon } from "./index";
const meta={title:"Icons/Nature/Thermometer",component:ThermometerIcon,args:{"aria-label":"Thermometer"},tags:["autodocs"]} satisfies Meta<typeof ThermometerIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ThermometerIcon size="0.875rem" aria-label="Thermometer 0.875rem"/><ThermometerIcon size="1rem" aria-label="Thermometer 1rem"/><ThermometerIcon size="1.25rem" aria-label="Thermometer 1.25rem"/><ThermometerIcon size="1.5rem" aria-label="Thermometer 1.5rem"/></div>};
