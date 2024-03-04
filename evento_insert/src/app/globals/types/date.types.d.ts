export interface DayWithTimes {
  day: string;
  start: string;
  end: string;
}

export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type FrequencyKey = "daily" | "weekly" | "yearly";

export type Frequency = {
  [key in FrequencyKey]?: WeekdayIndex[];
};
