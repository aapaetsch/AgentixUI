// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SettingsIcon } from "./index";
const meta={title:"Icons/Actions/Settings",component:SettingsIcon,args:{"aria-label":"Settings"},tags:["autodocs"]} satisfies Meta<typeof SettingsIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SettingsIcon size="0.875rem" aria-label="Settings 0.875rem"/><SettingsIcon size="1rem" aria-label="Settings 1rem"/><SettingsIcon size="1.25rem" aria-label="Settings 1.25rem"/><SettingsIcon size="1.5rem" aria-label="Settings 1.5rem"/></div>};
