// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { IndicatorsIcon } from "./index";
const meta={title:"Icons/Charts/Indicators",component:IndicatorsIcon,args:{"aria-label":"Indicators"},tags:["autodocs"]} satisfies Meta<typeof IndicatorsIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><IndicatorsIcon size="0.875rem" aria-label="Indicators 0.875rem"/><IndicatorsIcon size="1rem" aria-label="Indicators 1rem"/><IndicatorsIcon size="1.25rem" aria-label="Indicators 1.25rem"/><IndicatorsIcon size="1.5rem" aria-label="Indicators 1.5rem"/></div>};
