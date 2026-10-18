// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { MonitorIcon } from "./index";
const meta={title:"Icons/Media/Monitor",component:MonitorIcon,args:{"aria-label":"Monitor"},tags:["autodocs"]} satisfies Meta<typeof MonitorIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><MonitorIcon size="0.875rem" aria-label="Monitor 0.875rem"/><MonitorIcon size="1rem" aria-label="Monitor 1rem"/><MonitorIcon size="1.25rem" aria-label="Monitor 1.25rem"/><MonitorIcon size="1.5rem" aria-label="Monitor 1.5rem"/></div>};
