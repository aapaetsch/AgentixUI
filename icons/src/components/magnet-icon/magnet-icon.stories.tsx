// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MagnetIcon } from "./index";
const meta={title:"Icons/Charts/Magnet",component:MagnetIcon,args:{"aria-label":"Magnet"},tags:["autodocs"]} satisfies Meta<typeof MagnetIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MagnetIcon size="0.875rem" aria-label="Magnet 0.875rem"/><MagnetIcon size="1rem" aria-label="Magnet 1rem"/><MagnetIcon size="1.25rem" aria-label="Magnet 1.25rem"/><MagnetIcon size="1.5rem" aria-label="Magnet 1.5rem"/></div>};
