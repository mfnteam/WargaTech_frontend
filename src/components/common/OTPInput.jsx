import { useRef, useEffect, useState } from 'react';

export default function OTPInput({ length = 6, value = '', onChange, disabled = false }) {
  const [values, setValues] = useState(Array(length).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (value !== undefined) {
      const chars = value.split('').slice(0, length);
      const newValues = Array(length).fill('');
      chars.forEach((c, i) => { newValues[i] = c; });
      setValues(newValues);
    }
  }, [value, length]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    const char = val.slice(-1);

    const newValues = [...values];
    newValues[index] = char;
    setValues(newValues);
    onChange(newValues.join(''));

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, length);
    const newValues = Array(length).fill('');
    pasted.split('').forEach((c, i) => {
      if (i < length) newValues[i] = c;
    });
    setValues(newValues);
    onChange(newValues.join(''));

    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
      {values.map((val, i) => (
        <input
          key={i}
          ref={el => inputsRef.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold rounded-xl border transition-all outline-none ${
            val
              ? 'border-[#ea580c] bg-orange-50/30 text-gray-900 ring-2 ring-orange-100'
              : 'border-gray-200 bg-white text-gray-900 focus:border-[#ea580c] focus:ring-4 focus:ring-orange-100'
          }`}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}
