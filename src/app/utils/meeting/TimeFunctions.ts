import _ from "lodash";
import moment from "moment";

export const generateShortDaysNames = () => {
  const daysOfWeek = [];
  for (let i = 1; i <= 7; i++) {
    const dayName = _.capitalize(moment().day(i).format("ddd"));
    daysOfWeek.push(dayName);
  }
  return daysOfWeek;
};
