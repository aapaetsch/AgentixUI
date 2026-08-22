import type { Meta, StoryObj } from "@storybook/react"; import { OrderStatusBadge } from ".";
const meta={title:"Finance/Trading/OrderStatusBadge",component:OrderStatusBadge,args:{status:"working"}} satisfies Meta<typeof OrderStatusBadge>;export default meta;export const Working:StoryObj<typeof meta>={};export const Filled:StoryObj<typeof meta>={args:{status:"filled"}};
