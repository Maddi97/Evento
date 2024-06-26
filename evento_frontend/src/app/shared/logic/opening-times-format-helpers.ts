import { Event } from "../../globals/models/event";
import { WEEKDAYS_LONG } from "@globals/constants/dates";
/* calculate von bis for every event */
/* include always 24/7 open (is permanent and no openening times) von - bis per week day, if opening times than von - bis for every week day (open) and if von freitag 23 - sonntag 28 write with date von bis*/
export function openingTimesFormatter(event: Event): string {
  if (event.hasUnkownOpeningTimes) {
    return "";
  } else if (event.openingTimes && event.openingTimes.length > 0) {
    return "";
  } else if (!event.times || !event.times.start) {
    return "";
  } else if (event.times.start === event.times.end) {
    return "ganztägig geöffnet";
  } else if (!event.times.end) {
    return `Start: ${event.times.start} Uhr`;
  } else {
    return `${event.times.start} Uhr - ${event.times.end} Uhr`;
  }
}

export function dateTimesFormater(event: Event): string {
  if (event.hasUnkownOpeningTimes) {
    return "";
  }

  if (event.openingTimes && event.openingTimes.length > 0) {
    return "";
  } else if (event.permanent) return "jeden Tag offen";
  else if (event.frequency) {
    const weekly = event.frequency["weekly"];
    if (weekly.length === 7) return "jeden Tag offen";
    if (weekly.length === 1) return `jeden ${weekly[0]} offen`;
    let formattedFrequencies = weekly
      .slice(0, -1)
      .map((day) => `${WEEKDAYS_LONG[day]},`)
      .join(" ");
    formattedFrequencies = formattedFrequencies
      .replace(/,\s*$/, " ") //substitute last comma by space
      .concat(`und ${WEEKDAYS_LONG[weekly[weekly.length - 1]]}`);
    return `jeden ${formattedFrequencies}`;
  } else {
    const start = new Date(event.date.start);
    const end = new Date(event.date.end);
    const day1 = start.getDate().toString().padStart(2, "0"); // Get day and pad with zero if needed
    const month1 = (start.getMonth() + 1).toString().padStart(2, "0"); // Get month (adding 1 as it's 0-indexed) and pad
    const year1 = start.getFullYear();

    const day2 = end.getDate().toString().padStart(2, "0"); // Get day and pad with zero if needed
    const month2 = (end.getMonth() + 1).toString().padStart(2, "0"); // Get month (adding 1 as it's 0-indexed) and pad
    const year2 = end.getFullYear();

    if (day1 === day2 && month1 === month2 && year1 === year2) {
      return `${day1}.${month1}.${year1}`;
    } else return `${day1}.${month1}.${year1} - ${day2}.${month2}.${year2}`;
  }
}
