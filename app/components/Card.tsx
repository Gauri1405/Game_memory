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
      className={`
        aspect-square
        w-full
        rounded-xl
        cursor-pointer
        flex
        items-center
        justify-center
        transition-all
        duration-300
        border-2
        ${card.flipped || card.matched ? "border-blue-500" : "border-gray-700"}
      `}
    >
      {card.flipped || card.matched ? (
        <img
          src={card.image}
          alt="card"
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl">
          <span className="text-white text-4xl font-bold">?</span>
        </div>
      )}
    </div>
  );
}
