import type { Meta, StoryObj } from "@storybook/react"; import { AlertLog } from ".";
const meta={title:"Finance/Alerts/AlertLog",component:AlertLog,args:{events:[{id:"e1",ruleId:"a1",symbol:"AAPL",message:"Price crossed above 225",triggeredAt:"2026-08-19T16:30:00Z",value:225.12}]}} satisfies Meta<typeof AlertLog>;export default meta;export const Default:StoryObj<typeof meta>={};
