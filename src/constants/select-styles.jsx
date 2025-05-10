  export const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#333333",
      borderColor: state.hasValue ? "green" : "#333333",
      boxShadow: state.hasValue ? "0 0 0 1px green" : "none",
      color: "white",
      "&:hover": {
        borderColor: state.hasValue ? "green" : "#555555",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#444444" : "#333333",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#333333",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#555555",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#777777",
        color: "black",
      },
    }),
  };