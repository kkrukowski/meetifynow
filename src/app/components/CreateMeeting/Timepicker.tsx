const Timepicker = (props: {
  from: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: number;
}) => {
  const fromTime = 1;
  const toTime = 23;

  const renderOptions = () => {
    const optionsElements = [];
    // For start timepicker
    if (props.from) {
      for (let i = 0; i <= toTime; i++) {
        const optionElement = (
          <option key={i} value={i}>{`${i < 10 ? `0${i}` : i}:00`}</option>
        );
        optionsElements.push(optionElement);
      }
    }
    // For end timepicker
    if (!props.from) {
      for (let i = fromTime; i <= 24; i++) {
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
      value={props.value}
      onChange={props.onChange}
    >
      {renderOptions()}
    </select>
  );
};

export default Timepicker;
