"use client";

import { useEffect, useState } from "react";
import Card from "./components/Card";
import { shuffleArray } from "./utils/shuffle";
import { supabase } from "./utils/supabase";

export default function Home() {
  const images = [
    "/img1.png", "/img2.png", "/img3.png", "/img4.png",
    "/img5.png", "/img6.png", "/img7.png", "/img8.png",
  ];

  const [playerName, setPlayerName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);

  const [cards, setCards] = useState<any[]>([]);
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [secondCard, setSecondCard] = useState<number | null>(null);

  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false);
  const [win, setWin] = useState(false);

  // ------------ SAVE PROGRESS ------------------
  const saveProgress = async () => {
    if (!playerName) return;

    await supabase.from("memory_progress").upsert({
      player_name: playerName,
      cards: cards,
      moves: moves,
      timer: timer,
    });
  };

  // ------------ LOAD PROGRESS ------------------
  const loadProgress = async (name: string) => {
    const { data } = await supabase
      .from("memory_progress")
      .select("*")
      .eq("player_name", name)
      .single();

    if (data) {
      setCards(data.cards);
      setMoves(data.moves);
      setTimer(data.timer);
      setRunning(true);
      return true;
    }

    return false;
  };

  // ------------ TIMER LOGIC ------------------
  useEffect(() => {
    let interval: any;

    if (running) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  // ------------ CHECK WIN ------------------
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setWin(true);
      setRunning(false);
    }
  }, [cards]);

  // ------------ START GAME ------------------
  const startGame = () => {
    const pairImages = [...images, ...images];
    const shuffled = shuffleArray(
      pairImages.map((img, i) => ({
        id: i,
        image: img,
        flipped: false,
        matched: false,
      }))
    );

    setCards(shuffled);
    setRunning(true);
  };

  // ------------ CARD CLICK ------------------
  const handleCardClick = (i: number) => {
    if (locked) return;
    if (cards[i].flipped || cards[i].matched) return;

    const updatedCards = [...cards];
    updatedCards[i].flipped = true;
    setCards(updatedCards);

    if (firstCard === null) {
      setFirstCard(i);
    } else {
      setSecondCard(i);
      setLocked(true);
      setMoves((m) => m + 1);

      setTimeout(() => checkMatch(i), 700);
    }
  };

  // ------------ MATCH CHECK ------------------
  const checkMatch = (secondIndex: number) => {
    const firstIndex = firstCard as number;
    const newCards = [...cards];

    if (cards[firstIndex].image === cards[secondIndex].image) {
      newCards[firstIndex].matched = true;
      newCards[secondIndex].matched = true;
    } else {
      newCards[firstIndex].flipped = false;
      newCards[secondIndex].flipped = false;
    }

    setCards(newCards);
    setFirstCard(null);
    setSecondCard(null);
    setLocked(false);

    saveProgress();
  };

  // ------------ RESTART GAME ------------------
  const restartGame = () => {
    setWin(false);
    setMoves(0);
    setTimer(0);
    startGame();
  };

  // ------------ NAME INPUT SCREEN ------------------
  if (!nameEntered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl">Enter Your Name</h1>

        <input
          className="p-2 text-black rounded"
          placeholder="Your Name"
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <button
          className="bg-blue-600 px-4 py-2 rounded"
          onClick={async () => {
            if (playerName.trim() === "") return;

            const resumed = await loadProgress(playerName);

            if (!resumed) startGame();

            setNameEntered(true);
          }}
        >
          Start
        </button>
      </div>
    );
  }

  // ------------ WIN SCREEN ------------------
  if (win) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl">🎉 You Won, {playerName}!</h1>
        <p className="text-xl">Time: {timer}s</p>
        <p className="text-xl">Moves: {moves}</p>

        <button
          className="bg-green-600 px-4 py-2 rounded"
          onClick={restartGame}
        >
          Play Again
        </button>
      </div>
    );
  }

  // ------------ MAIN GAME UI ------------------
  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl mb-2">Memory Puzzle Game</h1>
      <h2 className="text-lg mb-4">Player: {playerName}</h2>

      <div className="flex gap-8 mb-6">
        <p>⏱ Time: {timer}s</p>
        <p>🎯 Moves: {moves}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card key={i} card={card} onClick={() => handleCardClick(i)} />
        ))}
      </div>
    </div>
  );
}
