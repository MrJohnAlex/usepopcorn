import { useState } from "react";
import Star from "./Star";
export default function StarRating({ maxRating = 5, onSetRating, size = 20 }) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  function set(rating) {
    setRating((cur) => (cur = rating));
    onSetRating(rating);
  }
  return (
    <div className="rating">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          onRate={() => set(i + 1)}
          full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
          onHoverIn={() => setTempRating(i + 1)}
          onHoverOut={() => setTempRating(0)}
          size={size}
        />
      ))}
      <p>{tempRating || rating || ""}</p>
    </div>
  );
}
