"use client";

export default function Card({ card, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`w-24 h-24 flex items-center justify-center border rounded-lg cursor-pointer text-white text-xl
      ${card.flipped || card.matched ? "bg-blue-500" : "bg-gray-700"}
      `}
    >
      {card.flipped || card.matched ? (
        <img
          src={card.image}
          alt="card"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        "?"
      )}
    </div>
  );
}
