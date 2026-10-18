// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { AlignJustifyIcon } from "./index";
const meta={title:"Icons/Layout/Align Justify",component:AlignJustifyIcon,args:{"aria-label":"Align Justify"},tags:["autodocs"]} satisfies Meta<typeof AlignJustifyIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><AlignJustifyIcon size="0.875rem" aria-label="Align Justify 0.875rem"/><AlignJustifyIcon size="1rem" aria-label="Align Justify 1rem"/><AlignJustifyIcon size="1.25rem" aria-label="Align Justify 1.25rem"/><AlignJustifyIcon size="1.5rem" aria-label="Align Justify 1.5rem"/></div>};
