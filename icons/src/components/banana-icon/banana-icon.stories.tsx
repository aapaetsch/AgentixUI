// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BananaIcon } from "./index";
const meta={title:"Icons/Nature/Banana",component:BananaIcon,args:{"aria-label":"Banana"},tags:["autodocs"]} satisfies Meta<typeof BananaIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BananaIcon size="0.875rem" aria-label="Banana 0.875rem"/><BananaIcon size="1rem" aria-label="Banana 1rem"/><BananaIcon size="1.25rem" aria-label="Banana 1.25rem"/><BananaIcon size="1.5rem" aria-label="Banana 1.5rem"/></div>};
