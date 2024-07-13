export default function Star({ onRate, full, onHoverIn, onHoverOut, size }) {
  const style = {
    cursor: "pointer",
  };
  return (
    <span
      style={style}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#fff"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
            fill="#fcc419"
          />
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#F1A635"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
            fill="#FFF"
          />
        </svg>
      )}
    </span>
  );
}
