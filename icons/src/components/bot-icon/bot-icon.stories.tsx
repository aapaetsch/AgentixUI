// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BotIcon } from "./index";
const meta={title:"Icons/Identity/Bot",component:BotIcon,args:{"aria-label":"Bot"},tags:["autodocs"]} satisfies Meta<typeof BotIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BotIcon size="0.875rem" aria-label="Bot 0.875rem"/><BotIcon size="1rem" aria-label="Bot 1rem"/><BotIcon size="1.25rem" aria-label="Bot 1.25rem"/><BotIcon size="1.5rem" aria-label="Bot 1.5rem"/></div>};
