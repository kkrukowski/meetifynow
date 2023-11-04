import moment from "moment";
import { useEffect, useState } from "react";

type DayTimesData = {
  date: number;
  times: number[];
};

export default function DetailedTimepicker(props: {
  dates: Array<DayTimesData>;
}) {
  const getPickedTimes = () => {
    const pickedTimesArrays = props.dates.map(
      (dateInfo: DayTimesData) => dateInfo.times
    );

    const pickedTimes = pickedTimesArrays.flat(1);

    return pickedTimes;
  };
  const [selectedTimecells, setSelectedTimecells] = useState<number[]>(
    getPickedTimes()
  );
  const [selectionMode, setSelectionMode] = useState(false);
  console.log(selectedTimecells);

  // Checking mobile mode
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const isMobile = () => {
    return windowSize[0] < 1024;
  };

  // Handling mouse down
  const [isMouseDown, setIsMouseDown] = useState(false);
  useEffect(() => {
    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
  }, [isMouseDown]);

  const isDateSelected = (dateTime: number) => {
    return selectedTimecells.some(
      (meetDatetime: number) => meetDatetime === dateTime
    );
  };

  // Answering functionallity
  const dates = props.dates;
  const days = dates.map((dateInfo: DayTimesData) => moment(dateInfo.date));

  const getSelectedTimecell = (dateTime: number) => {
    return selectedTimecells.find(
      (meetDatetime: number) => meetDatetime === dateTime
    );
  };

  const unselectTimecell = (dateTime: number) => {
    if (!isMobile()) {
      setUnselectMode(true);
    }
    setSelectedTimecells(
      selectedTimecells.filter(
        (meetDatetime: number) => meetDatetime !== dateTime
      )
    );
  };

  const [unselectMode, setUnselectMode] = useState(false);

  const toggleTimecell = (dateTime: number) => {
    if (isDateSelected(dateTime)) {
      if (!selectionMode) {
        unselectTimecell(dateTime);
      }

      if (selectionMode && unselectMode) {
        unselectTimecell(dateTime);
      }
    } else {
      // First click when timecell is NOT selected
      if (!unselectMode) {
        setSelectedTimecells([...selectedTimecells, dateTime]);
      }
    }
  };

  const disableSelection = () => {
    if (!isMouseDown) {
      setSelectionMode(false);
      setUnselectMode(false);
    }
  };

  const handleMouseOver = (dateTime: number) => {
    if (selectionMode) {
      toggleTimecell(dateTime);
    }
  };

  const renderTimeCells = () => {
    var timeCells: any = [];

    for (let i = 0; i <= 23; i++) {
      for (let h = 0; h < 2; h++) {
        let timeRow = [];
        for (let j = 0; j < days.length; j++) {
          const dateTime = days[j]
            .hour(i)
            .minute(h == 0 ? 0 : 30)
            .valueOf();

          const isEndOfWeek = moment.utc(dateTime).day() == 0;

          timeRow.push(
            <td key={dateTime}>
              <div
                data-date={dateTime}
                onMouseDown={() => {
                  toggleTimecell(dateTime);
                  if (!isMobile()) {
                    setSelectionMode(true);
                  }
                }}
                onMouseUp={() => {
                  if (!isMobile()) {
                    setSelectionMode(false);
                    setUnselectMode(false);
                  }
                }}
                onMouseOver={() => {
                  if (!isMobile()) {
                    handleMouseOver(dateTime);
                    disableSelection();
                  }
                }}
                className={`rounded-lg h-12 w-24 lg:h-6 lg:w-12 transition-colors ${
                  isEndOfWeek && "mr-4"
                } ${
                  isDateSelected(dateTime)
                    ? `bg-primary ${!isMobile() && "hover:bg-primary/50"}`
                    : `border border-gray ${
                        !isMobile() && "hover:border-none hover:bg-gray"
                      }`
                }`}
              ></div>
            </td>
          );
        }
        if (h == 0) {
          timeCells.push(
            <tr key={i + "00"} className="cursor-pointer">
              <th
                rowSpan={2}
                className="text-right text-dark align-top bg-light sticky left-0 pr-2"
              >
                {i.toString().padStart(2, "0")}:00
              </th>
              {timeRow}
            </tr>
          );
        } else if (h == 1) {
          timeCells.push(
            <tr key={i + "30"} className="cursor-pointer">
              {timeRow}
            </tr>
          );
        }
      }
    }

    return timeCells;
  };

  const daysNaming = ["Nd", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];

  const renderDaysHeadings = () => {
    return days.map((day: any) => (
      <th
        key={moment(day).date()}
        className={`bg-light sticky top-0 z-10 ${
          moment(day).day() == 0 && "pr-4"
        }`}
      >
        <p className="text-sm text-dark font-medium">
          {moment(day).date().toString().padStart(2, "0") +
            "." +
            (moment(day).month() + 1).toString().padStart(2, "0")}
        </p>
        <p className="text-dark">{daysNaming[moment(day).day()]}</p>
      </th>
    ));
  };

  return (
    <table className="time__seclection--table w-fit lg:mt-5 self-center select-none">
      <thead>
        <tr>
          <th className="bg-light sticky top-0 left-0 z-20"></th>
          {renderDaysHeadings()}
        </tr>
      </thead>
      <tbody>{renderTimeCells()}</tbody>
    </table>
  );
}
