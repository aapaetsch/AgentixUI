// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { PackageIcon } from "./index";
const meta={title:"Icons/Commerce/Package",component:PackageIcon,args:{"aria-label":"Package"},tags:["autodocs"]} satisfies Meta<typeof PackageIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><PackageIcon size="0.875rem" aria-label="Package 0.875rem"/><PackageIcon size="1rem" aria-label="Package 1rem"/><PackageIcon size="1.25rem" aria-label="Package 1.25rem"/><PackageIcon size="1.5rem" aria-label="Package 1.5rem"/></div>};
