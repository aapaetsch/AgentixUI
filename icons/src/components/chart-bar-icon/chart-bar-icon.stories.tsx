// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { ChartBarIcon } from "./index";
const meta={title:"Icons/Charts/Chart Bar",component:ChartBarIcon,args:{"aria-label":"Chart Bar"},tags:["autodocs"]} satisfies Meta<typeof ChartBarIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><ChartBarIcon size="0.875rem" aria-label="Chart Bar 0.875rem"/><ChartBarIcon size="1rem" aria-label="Chart Bar 1rem"/><ChartBarIcon size="1.25rem" aria-label="Chart Bar 1.25rem"/><ChartBarIcon size="1.5rem" aria-label="Chart Bar 1.5rem"/></div>};
