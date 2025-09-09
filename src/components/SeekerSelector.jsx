import { ComboSelector } from "./ComboSelector";

export const SeekerSelector = (props) => {
  const { value, items, onChange, ...others } = props;

  const handleChange = (event) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <ComboSelector
      items={items.map(item => ({ value: item.userId, label: item.name }))}
      value={value}
      onChange={handleChange}
      {...others}
    />
  );
};
