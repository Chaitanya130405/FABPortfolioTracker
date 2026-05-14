export default function InputField({ placeholder, type, inputValue }) {
  return (
    <input
      className="w-[300px] rounded-[30px] bg-purple-300 p-2"
      placeholder={placeholder}
      type={type}
      onChange={(event) => inputValue(event.target.value)}
    />
  );
}
