import { Time } from "../types/Time";
import { TimeRange } from "../types/TimeRange";

function containsPM(time: string): boolean {
  return time.toLowerCase().replace(".", "").includes("pm");
}

function containsAM(time: string): boolean {
  return time.toLowerCase().replace(".", "").includes("am");
}

function validateTime(time: Time): boolean {
  const { hour, minute } = time;

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return false;
  }

  return true;
}

export function convertToTwelveHourTime(time: Time): string | undefined {
  if (!validateTime(time)) {
    return undefined;
  }
  let isPm = false; // Default to AM unless provided (could do something smarter here prefer business hours eg 1pm more likely than 1am, but 9am more likely than 9pm)
  let hour = time.hour;
  let minute = String(time.minute).padStart(2, "0");
  if (time.hour > 12) {
    hour = time.hour % 12;
  }
  if (time.hour >= 12) {
    isPm = true;
  }
  if (time.hour === 0) {
    hour = 12;
  }
  return `${hour}:${minute}${isPm ? "pm" : "am"}`;
}

export function isTimeRangeValid(timeRange: TimeRange): boolean {
  if (!timeRange.from || !timeRange.to) {
    return false;
  }
  return (
    timeRange.to?.hour > timeRange.from?.hour ||
    (timeRange.to?.hour === timeRange.from?.hour && timeRange.to.minute > timeRange.from.minute)
  );
}

export function parseFromStringToTime(time: string): Time | undefined {
  try {
    const trimmedTime = time.replace(/\s:/g, "");
    const hourRegex = /^(0?\d|1\d|2[0-4])/;
    const minuteRegex = /(:?[0-5]\d)?/;
    const amPmRegex = /( ?[APap]\.?[Mm]\.?)?$/;
    const regex = new RegExp(`${hourRegex.source}${minuteRegex.source}${amPmRegex.source}`);
    const result = trimmedTime.match(regex);

    if (result === null) {
      return undefined;
    }

    const [_, hourPart = "", minPart = ""] = result;
    let hour = parseInt(hourPart, 10);
    // If we don't get a match for minutes, then we are at the start of the hour (0 minutes)
    let minute = minPart ? parseInt(minPart.replace(":", ""), 10) : 0;

    if (isNaN(hour) || isNaN(minute)) {
      return undefined;
    }

    const isAM = containsAM(trimmedTime) || hour < 12;
    const isPM = containsPM(trimmedTime) || hour >= 12;

    if (isPM && hour < 12) {
      hour += 12;
    }

    // handle midnight edge cases
    if ((isAM && hour === 12) || hour === 24) {
      hour = 0;
    }

    return { hour, minute };
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
