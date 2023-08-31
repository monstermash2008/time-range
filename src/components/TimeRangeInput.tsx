import { ChangeEvent, useCallback, useEffect, useState } from "react";
import "./TimeRangeInput.css";
import { convertToTwelveHourTime, isTimeRangeValid, parseFromStringToTime } from "../utils/TimeUtils";
import { TimeRange } from "../types/TimeRange";
import { Time } from "../types/Time";

type ErrorState = {
  fromError: boolean;
  toError: boolean;
  rangeError: boolean;
};

const DEFAULT_ERROR_STATE: ErrorState = { fromError: false, toError: false, rangeError: false };

function ValidationError({ error }: { error: ErrorState }) {
  const showRangeError = !error.fromError && !error.toError && error.rangeError;

  return (
    <ul className="warning">
      {showRangeError && <li>Time range not valid</li>}
      {error.fromError && <li>Start time not valid</li>}
      {error.toError && <li>End time not valid</li>}
    </ul>
  );
}

type TimeRangeInputProps = { initialValue: TimeRange; onChange?: (value: TimeRange) => void };
export function TimeRangeInput({ initialValue }: TimeRangeInputProps) {
  const [error, setError] = useState<ErrorState>(DEFAULT_ERROR_STATE);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialValue);

  useEffect(() => {
    if (!isTimeRangeValid(timeRange) && timeRange.from && timeRange.to) {
      setError({ ...error, rangeError: true });
    } else {
      setError({ ...error, rangeError: false });
    }
  }, [timeRange.from, timeRange.to]);

  return (
    <>
      <div className="time-range-input">
        <span>
          <SingleTimeInput
            initialValue={initialValue.from!}
            onChange={value => setTimeRange({ ...timeRange, from: value })}
            hasError={value => setError({ ...error, fromError: value })}
            placeholder="e.g. 9am"
          />
          ➜
          <SingleTimeInput
            initialValue={initialValue.to!}
            onChange={value => setTimeRange({ ...timeRange, to: value })}
            hasError={value => setError({ ...error, toError: value })}
            placeholder="5pm"
          />
        </span>
        <ValidationError error={error} />
      </div>
    </>
  );
}

type SingleTimeInputProps = {
  initialValue: Time;
  onChange: (value: Time | undefined) => void;
  hasError: (hasError: boolean) => void;
  placeholder: string;
};
function SingleTimeInput({ placeholder, onChange, hasError, initialValue }: SingleTimeInputProps) {
  const twelveHourTime = useCallback(() => convertToTwelveHourTime(initialValue), [initialValue]);
  const [value, setValue] = useState(twelveHourTime);
  const [time, setTime] = useState<Time | undefined>(initialValue);
  const [invalid, setInvalid] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const timeString = event.target.value;
    setValue(timeString);
    const time = parseFromStringToTime(timeString);
    setTime(time);
    setInvalid(!time);
  }

  function handleBlur() {
    if (time) {
      setValue(convertToTwelveHourTime(time));
      hasError(false);
    } else {
      // empty input is not an error, but an invalid non-empty input is
      hasError(!!value);
    }
    onChange(time);
  }

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={invalid ? "invalid" : ""}
    />
  );
}
