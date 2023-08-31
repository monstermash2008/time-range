import { it, expect, describe } from "vitest";
import { convertToTwelveHourTime, isTimeRangeValid, parseFromStringToTime } from "./TimeUtils";
import { Time } from "../types/Time";

describe("parseFromStringToTime", () => {
  it("12 hour time with am or pm and colon", () => {
    expect(parseFromStringToTime("9:30am")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("9:30pm")).toEqual({ hour: 21, minute: 30 });
    expect(parseFromStringToTime("12:30am")).toEqual({ hour: 0, minute: 30 });
    expect(parseFromStringToTime("12:30pm")).toEqual({ hour: 12, minute: 30 });
    expect(parseFromStringToTime("12:00pm")).toEqual({ hour: 12, minute: 0 });
    expect(parseFromStringToTime("12:00am")).toEqual({ hour: 0, minute: 0 });
  });

  it("12 hour time with am or pm and no colon", () => {
    expect(parseFromStringToTime("9am")).toEqual({ hour: 9, minute: 0 });
    expect(parseFromStringToTime("9pm")).toEqual({ hour: 21, minute: 0 });
    expect(parseFromStringToTime("930am")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("930pm")).toEqual({ hour: 21, minute: 30 });
    expect(parseFromStringToTime("1230am")).toEqual({ hour: 0, minute: 30 });
    expect(parseFromStringToTime("1230pm")).toEqual({ hour: 12, minute: 30 });
    expect(parseFromStringToTime("1200am")).toEqual({ hour: 0, minute: 0 });
    expect(parseFromStringToTime("1200pm")).toEqual({ hour: 12, minute: 0 });
  });

  it("12 hour time with am or pm capitalised", () => {
    expect(parseFromStringToTime("9AM")).toEqual({ hour: 9, minute: 0 });
    expect(parseFromStringToTime("930PM")).toEqual({ hour: 21, minute: 30 });
    expect(parseFromStringToTime("1230PM")).toEqual({ hour: 12, minute: 30 });
  });

  it("12 hour time with am or pm dot notation", () => {
    expect(parseFromStringToTime("9 p.m")).toEqual({ hour: 21, minute: 0 });
    expect(parseFromStringToTime("9 p.m.")).toEqual({ hour: 21, minute: 0 });
    expect(parseFromStringToTime("930 a.m")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("9:30 a.m")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("1230 a.m")).toEqual({ hour: 0, minute: 30 });
  });

  it("12 hour time without am or pm and with colon", () => {
    expect(parseFromStringToTime("9:30")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("12:00")).toEqual({ hour: 12, minute: 0 });
    expect(parseFromStringToTime("12:30")).toEqual({ hour: 12, minute: 30 });
  });

  it("12 hour time without am or pm and without colon", () => {
    expect(parseFromStringToTime("9")).toEqual({ hour: 9, minute: 0 });
    expect(parseFromStringToTime("930")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("0")).toEqual({ hour: 0, minute: 0 });
    expect(parseFromStringToTime("11")).toEqual({ hour: 11, minute: 0 });
    expect(parseFromStringToTime("12")).toEqual({ hour: 12, minute: 0 });
  });

  it("12 hour time with am or pm with a space", () => {
    expect(parseFromStringToTime("9 AM")).toEqual({ hour: 9, minute: 0 });
    expect(parseFromStringToTime("9 PM")).toEqual({ hour: 21, minute: 0 });
    expect(parseFromStringToTime("1230 AM")).toEqual({ hour: 0, minute: 30 });
    expect(parseFromStringToTime("1230 PM")).toEqual({ hour: 12, minute: 30 });
  });

  it("24 hour time", () => {
    expect(parseFromStringToTime("0000")).toEqual({ hour: 0, minute: 0 });
    expect(parseFromStringToTime("0001")).toEqual({ hour: 0, minute: 1 });
    expect(parseFromStringToTime("0010")).toEqual({ hour: 0, minute: 10 });
    expect(parseFromStringToTime("0059")).toEqual({ hour: 0, minute: 59 });
    expect(parseFromStringToTime("0930")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("1200")).toEqual({ hour: 12, minute: 0 });
    expect(parseFromStringToTime("1201")).toEqual({ hour: 12, minute: 1 });
    expect(parseFromStringToTime("2355")).toEqual({ hour: 23, minute: 55 });

    expect(parseFromStringToTime("2400")).toEqual({ hour: 0, minute: 0 });
  });

  it("24 hour time with colon", () => {
    expect(parseFromStringToTime("00:00")).toEqual({ hour: 0, minute: 0 });
    expect(parseFromStringToTime("09:30")).toEqual({ hour: 9, minute: 30 });
    expect(parseFromStringToTime("23:55")).toEqual({ hour: 23, minute: 55 });
    expect(parseFromStringToTime("24:00")).toEqual({ hour: 0, minute: 0 });
  });

  it("24 hour time shorthand", () => {
    expect(parseFromStringToTime("13")).toEqual({ hour: 13, minute: 0 });
    expect(parseFromStringToTime("21")).toEqual({ hour: 21, minute: 0 });
    expect(parseFromStringToTime("24")).toEqual({ hour: 0, minute: 0 });
  });

  it("invalid cases", () => {
    expect(parseFromStringToTime("hello")).toBeUndefined();
    expect(parseFromStringToTime("0060")).toBeUndefined();
    expect(parseFromStringToTime("2500")).toBeUndefined();
    expect(parseFromStringToTime("00:60")).toBeUndefined();
    expect(parseFromStringToTime("25:00")).toBeUndefined();
    expect(parseFromStringToTime("25")).toBeUndefined();
  });
});

describe("convertToTwelveHourTime", () => {
  it("valid cases", () => {
    expect(convertToTwelveHourTime({ hour: 0, minute: 0 })).toBe("12:00am");
    expect(convertToTwelveHourTime({ hour: 0, minute: 1 })).toBe("12:01am");
    expect(convertToTwelveHourTime({ hour: 9, minute: 30 })).toBe("9:30am");
    expect(convertToTwelveHourTime({ hour: 12, minute: 30 })).toBe("12:30pm");
    expect(convertToTwelveHourTime({ hour: 13, minute: 30 })).toBe("1:30pm");
    expect(convertToTwelveHourTime({ hour: 23, minute: 30 })).toBe("11:30pm");
  });

  it("invalid cases", () => {
    expect(convertToTwelveHourTime({ hour: 25, minute: 0 })).toBeUndefined();
    expect(convertToTwelveHourTime({ hour: -1, minute: -30 })).toBeUndefined();
    expect(convertToTwelveHourTime({ hour: 9, minute: 60 })).toBeUndefined();
    expect(convertToTwelveHourTime({ hour: 9, minute: 61 })).toBeUndefined();
  });
});

describe("isTimeRangeValid", () => {
  it("midnight to 11:59pm", () => {
    const from: Time = { hour: 0, minute: 0 };
    const to: Time = { hour: 23, minute: 59 };
    expect(isTimeRangeValid({ from, to })).toBeTruthy();
  });
  it("midday to midnight", () => {
    const from: Time = { hour: 12, minute: 0 };
    const to: Time = { hour: 24, minute: 0 };
    expect(isTimeRangeValid({ from, to })).toBeTruthy();
  });
  it("minutes", () => {
    const from: Time = { hour: 21, minute: 20 };
    const to: Time = { hour: 21, minute: 30 };
    expect(isTimeRangeValid({ from, to })).toBeTruthy();
  });
  it("invalid hours", () => {
    const from: Time = { hour: 21, minute: 0 };
    const to: Time = { hour: 13, minute: 30 };
    expect(isTimeRangeValid({ from, to })).toBeFalsy();
  });
  it("invalid minutes", () => {
    const from: Time = { hour: 21, minute: 30 };
    const to: Time = { hour: 21, minute: 20 };
    expect(isTimeRangeValid({ from, to })).toBeFalsy();
  });
});
