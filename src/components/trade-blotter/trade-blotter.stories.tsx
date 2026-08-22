import type { Meta, StoryObj } from "@storybook/react"; import { TradeBlotter } from ".";
const meta={title:"Finance/Trading/TradeBlotter",component:TradeBlotter,args:{executions:[{id:"t1",symbol:"SPY",side:"buy",quantity:50,price:667.42,executedAt:"2026-08-19T15:22:05Z",venue:"ARCA"}]}} satisfies Meta<typeof TradeBlotter>;export default meta;export const Default:StoryObj<typeof meta>={};
