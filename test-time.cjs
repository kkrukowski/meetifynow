const moment = require("moment");
function isDatetime(datetime) {
  return datetime.toString().length === 13;
}
function convertDatetimeToTime(datetime) {
  return moment(datetime);
}
function getTimeRangeDatetimes(datetime, from, to) {
  const datetimes = [];
  if (isDatetime(from)) from = convertDatetimeToTime(from).hour();
  if (isDatetime(to)) to = convertDatetimeToTime(to).hour() + 1;

  for (let i = from; i < to; i++) {
    for (let hourHalf = 0; hourHalf < 2; hourHalf++) {
      datetimes.push(
        moment(datetime)
            .hour(i)
            .minute(hourHalf * 30)
            .valueOf(),
      );
    }
  }
  return datetimes;
}

console.log(getTimeRangeDatetimes(1713500000000, 8, 9));
