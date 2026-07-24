// Server-safe root entrypoint.
//
// This entry is used by the `react-server` export condition so Next.js App
// Router server components do not evaluate the full client-heavy root barrel.

export { cn } from "./lib/utils";

export {
  Typography,
  NumericText,
  typographyVariants,
  numericTextVariants,
} from "./components/typography";
export type {
  TypographyProps,
  NumericTextOptions,
  NumericTextProps,
} from "./components/typography";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/table";
export type { TableProps } from "./components/table";

export { VisuallyHidden } from "./components/visually-hidden";
export type { VisuallyHiddenProps } from "./components/visually-hidden";

export {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatCompact,
  formatBasisPoints,
  formatSigned,
  roundToTick,
} from "./lib/number-utils";
export type { NumericFormat } from "./lib/number-utils";

export {
  formatDate,
  formatDateRange,
  formatTime,
  formatDateTime,
  DATE_FORMATS,
  parseDate,
  parseTime,
  validateDate,
  isValidDate,
  isDateInRange,
  getDatePresets,
  getDateRangePresets,
  evaluatePreset,
  to12HourFormat,
  to24HourFormat,
  combineDateAndTime,
  extractTime,
  getHoursArray,
  getMinutesArray,
  format,
  parse,
  isValid,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isSameDay,
  isSameMonth,
  isSameYear,
  getDaysInMonth,
  getMonth,
  getYear,
  getDay,
  setHours,
  setMinutes,
  setMonth,
  setYear,
  getHours,
  getMinutes,
} from "./lib/date-utils";

export {
  formatRelativeTime,
  formatRelativeTimeShort,
  formatDuration,
} from "./lib/time-utils";

export {
  pnlColorClass,
  sentimentColor,
  resolveToken,
} from "./lib/color-utils";