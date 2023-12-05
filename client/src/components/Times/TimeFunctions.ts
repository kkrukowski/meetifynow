const convertDatetimeToTime = (datetime: number) => {
  return moment(datetime);
};

const isDatetime = (datetime: number) => {
  return datetime.toString().length === 13;
};

const getTimeRangeDatetimes = (datetime: number, from: number, to: number) => {
  const datetimes: number[] = [];

  if (isDatetime(from)) {
    from = convertDatetimeToTime(from).hour();
  }
  if (isDatetime(to)) {
    to = convertDatetimeToTime(to).hour() + 1;
  }
  for (let i = from; i < to; i++) {
    for (let hourHalf = 0; hourHalf < 2; hourHalf++) {
      const time = moment(datetime)
        .hour(i)
        .minute(hourHalf * 30)
        .valueOf();

      datetimes.push(time);
    }
  }

  return datetimes;
};

exports.module = {
  convertDatetimeToTime,
  isDatetime,
  getTimeRangeDatetimes,
};
