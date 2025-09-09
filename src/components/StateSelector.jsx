import { ComboSelector } from "./ComboSelector";

export const StateSelector = (props) => {
  const { value, onChange, ...others } = props;
  const states = ["Applied", "Failed", "Recruiter", "HR M", "Tech", "Culture", "Hired"];

  const handleChange = (event) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <ComboSelector
      items={states.map((state, index) => ({ value: index, label: state }))}
      value={value}
      onChange={handleChange}
      {...others}
    />
  );
};
