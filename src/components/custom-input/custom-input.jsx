import { forwardRef } from "react";

const CustomInput = forwardRef(
  ({ type, placeholder, className, ...rest }, ref) => (
    <input
      type={type}
      placeholder={placeholder}
      className={`!p-2 rounded-md bg-white text-black !border-1 focus:!border-2 border-black ${className}`}
      ref={ref}
      {...rest}
    />
  )
);

export default CustomInput;
