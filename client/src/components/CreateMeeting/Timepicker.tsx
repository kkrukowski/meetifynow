const Timepicker = (props: {
  from: boolean;
  fromTime: number;
  toTime: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  const defaultTime = () => {
    if (props.from) {
      return props.fromTime;
    }
    if (!props.from) {
      return props.toTime + 1;
    }
  };

  const renderOptions = () => {
    const optionsElements = [];
    // For start timepicker
    if (props.from) {
      for (let i = 1; i <= props.toTime; i++) {
        const optionElement = (
          <option key={i} value={i}>{`${i < 10 ? `0${i}` : i}:00`}</option>
        );
        optionsElements.push(optionElement);
      }
    }
    // For end timepicker
    if (!props.from) {
      for (let i = props.fromTime + 1; i <= 24; i++) {
        const optionElement = (
          <option key={i} value={i}>{`${i < 10 ? `0${i}` : i}:00`}</option>
        );
        optionsElements.push(optionElement);
      }
    }

    return optionsElements;
  };

  return (
    <select
      id={props.from ? "timepicker__from" : "timepicker__to"}
      className="p-2 text-lg text-dark border border-gray rounded-lg focus:outline-none focus:ring focus:border-primary transition-all"
      defaultValue={defaultTime()}
      onChange={props.onChange}
    >
      {renderOptions()}
    </select>
  );
};

export default Timepicker;
