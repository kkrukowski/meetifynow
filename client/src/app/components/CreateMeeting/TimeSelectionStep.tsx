import DetailedTimepicker from "@/components/CreateMeeting/DetailedTimepicker";
import Timepicker from "@/components/CreateMeeting/Timepicker";
import IconButton from "@/components/IconButton";
import { generateShortDaysNames } from "@/utils/meeting/TimeFunctions";
import {
  faCalendar,
  faCalendarDay,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import moment from "moment";
import React from "react";

// ... (definicje interfejsów DailyTimeRange, DailyHours)

interface TimeSelectionStepProps {
  delta: number;
  timepickerIndex: number;
  setTimepickerIndex: (index: number) => void;
  mainFromTime: number;
  mainToTime: number;
  setMainFromTime: (time: number) => void;
  setMainToTime: (time: number) => void;
  dailyTimeRanges: any[]; // Użyj dokładniejszego typu
  dailyHours: any; // Użyj dokładniejszego typu
  handleDailyHourChange: (
    date: number,
    type: "from" | "to",
    value: number
  ) => void;
  pushSelectedTimecell: (dayDateTime: number, dateTime: number) => void;
  popUnselectedTimecell: (dayDateTime: number, dateTime: number) => void;
}

const TimeSelectionStep: React.FC<TimeSelectionStepProps> = ({
  delta,
  timepickerIndex,
  setTimepickerIndex,
  mainFromTime,
  mainToTime,
  setMainFromTime,
  setMainToTime,
  dailyTimeRanges,
  dailyHours,
  handleDailyHourChange,
  pushSelectedTimecell,
  popUnselectedTimecell,
}) => {
  const shortDaysNames = generateShortDaysNames();

  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex justify-center mb-5">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-6">
            <IconButton
              icon={faCalendar}
              onClick={() => setTimepickerIndex(0)}
              isCurrent={timepickerIndex === 0}
            />
            <IconButton
              icon={faCalendarDay}
              className="ml-6"
              onClick={() => setTimepickerIndex(1)}
              isCurrent={timepickerIndex === 1}
            />
            <IconButton
              icon={faCalendarDays}
              className="ml-6"
              onClick={() => setTimepickerIndex(2)}
              isCurrent={timepickerIndex === 2}
            />
          </div>
          <div
            className={`self-center overflow-y-auto h-[300px] ${
              timepickerIndex !== 2 && "p-2"
            }`}
          >
            {timepickerIndex === 0 && (
              <>
                <Timepicker
                  from={true}
                  value={mainFromTime}
                  onChange={(e) => {
                    const newFrom = +e.target.value;
                    setMainFromTime(newFrom);
                    if (newFrom >= mainToTime)
                      setMainToTime(Math.min(newFrom + 1, 24));
                  }}
                />
                <span className="m-4"> - </span>
                <Timepicker
                  from={false}
                  value={mainToTime}
                  onChange={(e) => {
                    const newTo = +e.target.value;
                    setMainToTime(newTo);
                    if (newTo <= mainFromTime)
                      setMainFromTime(Math.max(newTo - 1, 0));
                  }}
                />
              </>
            )}
            {timepickerIndex === 1 && (
              <>
                {dailyTimeRanges.map((dayTimeRange) => {
                  const dateObj = moment(dayTimeRange.date);
                  const { from, to } = dailyHours[dayTimeRange.date] || {
                    from: mainFromTime,
                    to: mainToTime,
                  };
                  return (
                    <div
                      key={dayTimeRange.date}
                      className="flex justify-between w-[310px] md:w-[400px] items-center mb-4 px-2"
                    >
                      <div className="flex flex-col h-14 w-14 bg-primary rounded-lg justify-center">
                        <p className="text-3xl text-center text-light leading-none">
                          {dateObj.date()}
                        </p>
                        <p className="text-center text-light leading-none">
                          {
                            shortDaysNames[
                              dateObj.day() === 0 ? 6 : dateObj.day() - 1
                            ]
                          }
                        </p>
                      </div>
                      <div>
                        <Timepicker
                          from={true}
                          value={from}
                          onChange={(e) =>
                            handleDailyHourChange(
                              dayTimeRange.date,
                              "from",
                              +e.target.value
                            )
                          }
                        />
                        <span className="m-2 md:m-4"> - </span>
                        <Timepicker
                          from={false}
                          value={to}
                          onChange={(e) =>
                            handleDailyHourChange(
                              dayTimeRange.date,
                              "to",
                              +e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {timepickerIndex === 2 && (
              <div className="w-auto max-w-[330px] md:max-w-[700px] lg:max-w-[350px]">
                <DetailedTimepicker
                  dates={dailyTimeRanges}
                  pushSelectedTimecell={pushSelectedTimecell}
                  popUnselectedTimecell={popUnselectedTimecell}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimeSelectionStep;
