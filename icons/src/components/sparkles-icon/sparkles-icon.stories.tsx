// Generated; edit the catalog or generator.
import type { Meta, StoryObj } from "@storybook/react";
import { SparklesIcon } from "./index";
const meta={title:"Icons/Actions/Sparkles",component:SparklesIcon,args:{"aria-label":"Sparkles"},tags:["autodocs"]} satisfies Meta<typeof SparklesIcon>;
export default meta;
type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Sizes:Story={render:()=> <div className="flex items-center gap-5"><SparklesIcon size="0.875rem" aria-label="Sparkles 0.875rem"/><SparklesIcon size="1rem" aria-label="Sparkles 1rem"/><SparklesIcon size="1.25rem" aria-label="Sparkles 1.25rem"/><SparklesIcon size="1.5rem" aria-label="Sparkles 1.5rem"/></div>};
