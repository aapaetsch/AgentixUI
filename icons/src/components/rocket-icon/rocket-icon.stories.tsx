// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { RocketIcon } from "./index";
const meta={title:"Icons/Commerce/Rocket",component:RocketIcon,args:{"aria-label":"Rocket"},tags:["autodocs"]} satisfies Meta<typeof RocketIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><RocketIcon size="0.875rem" aria-label="Rocket 0.875rem"/><RocketIcon size="1rem" aria-label="Rocket 1rem"/><RocketIcon size="1.25rem" aria-label="Rocket 1.25rem"/><RocketIcon size="1.5rem" aria-label="Rocket 1.5rem"/></div>};
