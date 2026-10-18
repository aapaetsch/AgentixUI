import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  TechnicalChartView,
  createTechnicalChartViewState,
  technicalChartViewReducer,
  type TechnicalChartViewState,
} from "../../index";
import {
  technicalChartFixture,
  accurateProfileFixture,
  createTechnicalChartFixture,
} from "./fixtures";

const meta = {
  title: "Market Charts/TechnicalChartView",
  component: TechnicalChartView,
  parameters: { layout: "fullscreen", controls: { disable: true } },
} satisfies Meta<typeof TechnicalChartView>;
export default meta;
type Story = StoryObj<typeof meta>;
function Demo({
  light = false,
  narrow = false,
  maximized = false,
  loading = false,
  empty = false,
  error = false,
  accurate = false,
  reduced = false,
  stress = false,
}: {
  light?: boolean;
  narrow?: boolean;
  maximized?: boolean;
  loading?: boolean;
  empty?: boolean;
  error?: boolean;
  accurate?: boolean;
  reduced?: boolean;
  stress?: boolean;
}) {
  const [symbol, setSymbol] = React.useState("NOVA");
  const [interval, setInterval] = React.useState("1D");
  const data = React.useMemo(
    () =>
      stress ? createTechnicalChartFixture(100000) : technicalChartFixture,
    [stress],
  );
  const [state, dispatch] = React.useReducer(
    technicalChartViewReducer,
    undefined,
    (): TechnicalChartViewState => {
      const state = createTechnicalChartViewState();
      state.chrome.maximized = maximized;
      if (stress) {
        state.profiles[0].rows = 100;
        state.drawings = Array.from({ length: 100 }, (_, index) => ({
          id: `line-${index}`,
          type: "horizontal-line",
          version: 1,
          visible: true,
          locked: true,
          points: [
            {
              time: data.at(-1)!.time,
              price: data.at(-1)!.close - 10 + index * 0.2,
            },
          ],
          parameters: { color: "#68778d", lineWidth: 1 },
        }));
      }
      return state;
    },
  );
  return (
    <div
      className={light ? "" : "dark"}
      style={{
        padding: narrow ? 0 : "1rem",
        width: narrow ? "20rem" : "100%",
        minHeight: "52rem",
        position: "relative",
        background: light ? "#f8fafc" : "#0c1018",
      }}
    >
      <TechnicalChartView
        symbol={symbol}
        interval={interval}
        data={empty ? [] : data}
        state={state}
        onStateChange={(next) => dispatch({ type: "replace", state: next })}
        onSymbolChange={setSymbol}
        onIntervalChange={setInterval}
        appearance={{
          title: "NOVA · Daily workspace",
          height: narrow ? 640 : 660,
        }}
        earnings={
          stress || empty
            ? []
            : [
                {
                  id: "q1",
                  time: technicalChartFixture[130].time,
                  label: "Q1 earnings",
                  session: "after-close",
                  reportedEps: 1.24,
                  estimatedEps: 1.18,
                },
                {
                  id: "q2",
                  time: technicalChartFixture[194].time,
                  label: "Q2 earnings",
                  session: "before-open",
                  reportedEps: 1.38,
                  estimatedEps: 1.3,
                },
                {
                  id: "q3",
                  time: Number(technicalChartFixture.at(-1)!.time) + 21 * 86400,
                  label: "Q3 earnings",
                  estimated: true,
                  session: "after-close",
                  estimatedEps: 1.42,
                },
              ]
        }
        loading={loading}
        error={
          error
            ? "Chart data could not be loaded. Try a different range."
            : undefined
        }
        profileSources={
          accurate
            ? {
                "visible-profile": {
                  kind: "levels",
                  levels: accurateProfileFixture,
                },
              }
            : undefined
        }
        status={
          <span className="px-2 text-muted-foreground">Synthetic data</span>
        }
        className={
          reduced ? "[&_*]:!animate-none [&_*]:!transition-none" : undefined
        }
      />
    </div>
  );
}
export const CompleteTechnicalAnalysis: Story = { render: () => <Demo /> };
export const Light: Story = { render: () => <Demo light /> };
export const NarrowResponsive: Story = { render: () => <Demo narrow /> };
export const FullscreenContained: Story = { render: () => <Demo maximized /> };
export const Loading: Story = { render: () => <Demo loading /> };
export const Empty: Story = { render: () => <Demo empty /> };
export const Error: Story = { render: () => <Demo error /> };
export const AccurateProfileLevels: Story = { render: () => <Demo accurate /> };
export const ApproximateProfileFromBars: Story = { render: () => <Demo /> };
export const ReducedMotion: Story = { render: () => <Demo reduced /> };
export const Stress: Story = { render: () => <Demo stress /> };
export const KeyboardNavigation: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("toolbar", { name: "Chart commands" }),
    ).toBeVisible();
    const chart = canvas.getByRole("img", {
      name: "Interactive market price chart",
    });
    chart.focus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}+");
    await expect(chart).toHaveFocus();
  },
};
