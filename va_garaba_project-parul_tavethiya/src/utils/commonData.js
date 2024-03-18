import makeAnimated from "react-select/animated";

export const bloodData = [
  { value: "O+", label: "+ O Positive" },
  { value: "O-", label: "- O Negetive" },
  { value: "A-", label: "- A Negetive" },
  { value: "A+", label: "+ A Positive" },
  { value: "AB+", label: "+ AB Positive" },
  { value: "AB-", label: "- AB Negetive" },
  { value: "B-", label: "- B Negetive" },
  { value: "B+", label: "+ B Positive" },
];

export const genderData = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const animatedComponents = makeAnimated();
