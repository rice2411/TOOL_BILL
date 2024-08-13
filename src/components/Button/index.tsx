import { IButtonProps } from "./props";

function Button(props: IButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${props.className}`}
    >
      {props.icon && <img src={props.icon} alt="" className="w-5 h-5 mr-2" />}
      {props.text}
    </button>
  );
}

export default Button;
