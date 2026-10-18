// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { BriefcaseIcon } from "./index";
const meta={title:"Icons/Commerce/Briefcase",component:BriefcaseIcon,args:{"aria-label":"Briefcase"},tags:["autodocs"]} satisfies Meta<typeof BriefcaseIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><BriefcaseIcon size="0.875rem" aria-label="Briefcase 0.875rem"/><BriefcaseIcon size="1rem" aria-label="Briefcase 1rem"/><BriefcaseIcon size="1.25rem" aria-label="Briefcase 1.25rem"/><BriefcaseIcon size="1.5rem" aria-label="Briefcase 1.5rem"/></div>};
