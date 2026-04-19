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
  dict: any;
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
    value: number,
  ) => void;
  pushSelectedTimecell: (dayDateTime: number, dateTime: number) => void;
  popUnselectedTimecell: (dayDateTime: number, dateTime: number) => void;
}

const TimeSelectionStep: React.FC<TimeSelectionStepProps> = ({
  dict,
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
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-row justify-center items-center gap-4 md:gap-6 mb-8 p-3 rounded-[24px]">
            <IconButton
              icon={faCalendar}
              onClick={() => setTimepickerIndex(0)}
              isCurrent={timepickerIndex === 0}
            />
            <IconButton
              icon={faCalendarDay}
              onClick={() => setTimepickerIndex(1)}
              isCurrent={timepickerIndex === 1}
            />
            <IconButton
              icon={faCalendarDays}
              onClick={() => setTimepickerIndex(2)}
              isCurrent={timepickerIndex === 2}
            />
          </div>
          <div
            className={`self-center overflow-y-auto h-[300px] w-full flex justify-center ${
              timepickerIndex !== 2 && "p-2"
            }`}
          >
            {timepickerIndex === 0 && (
              <div className="flex flex-col items-center justify-start gap-6 w-full max-w-md pt-4">
                <p className="text-gray text-center font-medium px-4 leading-relaxed bg-[#f0f4f8] py-3 rounded-[16px] border border-dark/5 shadow-sm">
                  {dict.page.createMeeting.step.three.description}
                </p>
                <div className="flex items-center justify-center gap-4">
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
                  <span className="text-gray/50 font-medium"> - </span>
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
                </div>
              </div>
            )}
            {timepickerIndex === 1 && (
              <div className="flex flex-col gap-4 mt-2">
                {dailyTimeRanges.map((dayTimeRange) => {
                  const dateObj = moment(dayTimeRange.date);
                  const { from, to } = dailyHours[dayTimeRange.date] || {
                    from: mainFromTime,
                    to: mainToTime,
                  };
                  return (
                    <div
                      key={dayTimeRange.date}
                      className="flex justify-between w-[310px] md:w-[400px] items-center px-4 py-3 bg-white rounded-[16px] border border-gray/10 shadow-sm"
                    >
                      <div className="flex flex-col h-12 w-12 bg-primary/10 rounded-[12px] justify-center items-center">
                        <p className="text-xl font-bold text-primary leading-none">
                          {dateObj.date()}
                        </p>
                        <p className="text-xs font-semibold text-primary/70 leading-none mt-1 uppercase">
                          {
                            shortDaysNames[
                              dateObj.day() === 0 ? 6 : dateObj.day() - 1
                            ]
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timepicker
                          from={true}
                          value={from}
                          onChange={(e) =>
                            handleDailyHourChange(
                              dayTimeRange.date,
                              "from",
                              +e.target.value,
                            )
                          }
                        />
                        <span className="text-gray/50 font-medium"> - </span>
                        <Timepicker
                          from={false}
                          value={to}
                          onChange={(e) =>
                            handleDailyHourChange(
                              dayTimeRange.date,
                              "to",
                              +e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
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
