"use client";

type CardItem = {
  flipped: boolean;
  matched: boolean;
  image: string;
};

type Props = {
  card: CardItem;
  onClick: () => void;
};

export default function Card({ card, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`w-24 h-24 rounded-md cursor-pointer flex items-center justify-center 
      bg-white transition-all duration-300
      ${card.flipped || card.matched ? "border-2 border-blue-500" : "border-2 border-gray-700"}`}
    >
      {card.flipped || card.matched ? (
        <img src={card.image} alt="card" className="w-full h-full object-cover rounded-md" />
      ) : (
        <div className="w-full h-full bg-gray-900 rounded-md"></div>
      )}
    </div>
  );
}
