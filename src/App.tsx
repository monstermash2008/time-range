import { TimeRangeInput } from "./components/TimeRangeInput";
import { TimeRange } from "./types/TimeRange";

function App() {
  const timeRange: TimeRange = {
    from: { hour: 9, minute: 0 },
    to: { hour: 17, minute: 0 },
  };

  return (
    <div className="card">
      <p>Enter your work hours</p>
      <TimeRangeInput initialValue={timeRange} />
    </div>
  );
}

export default App;
