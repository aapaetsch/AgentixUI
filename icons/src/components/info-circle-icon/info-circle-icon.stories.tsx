// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { InfoCircleIcon } from "./index";
const meta={title:"Icons/Feedback/Info Circle",component:InfoCircleIcon,args:{"aria-label":"Info Circle"},tags:["autodocs"]} satisfies Meta<typeof InfoCircleIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><InfoCircleIcon size="0.875rem" aria-label="Info Circle 0.875rem"/><InfoCircleIcon size="1rem" aria-label="Info Circle 1rem"/><InfoCircleIcon size="1.25rem" aria-label="Info Circle 1.25rem"/><InfoCircleIcon size="1.5rem" aria-label="Info Circle 1.5rem"/></div>};
