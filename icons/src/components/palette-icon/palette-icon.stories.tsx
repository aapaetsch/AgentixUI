// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PaletteIcon } from "./index";
const meta={title:"Icons/Charts/Palette",component:PaletteIcon,args:{"aria-label":"Palette"},tags:["autodocs"]} satisfies Meta<typeof PaletteIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PaletteIcon size="0.875rem" aria-label="Palette 0.875rem"/><PaletteIcon size="1rem" aria-label="Palette 1rem"/><PaletteIcon size="1.25rem" aria-label="Palette 1.25rem"/><PaletteIcon size="1.5rem" aria-label="Palette 1.5rem"/></div>};
