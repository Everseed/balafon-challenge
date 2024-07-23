import Link from 'next/link';
import React from 'react';

interface Game {
  id: string;
  name: string;
}

const mockGames: Game[] = [
  { id: '1', name: 'Game One' },
  { id: '2', name: 'Game Two' },
  { id: '3', name: 'Game Three' }
];

export const GameGrid = () => {
  return (
    <div className="p-2 h-[calc(100vh-14rem)] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 h-60">
        {mockGames.map((game) => (
          <div key={game.id} className="p-4">
            <p>{`Game: ${game.name}`}</p>
            <Link
              href={{
                pathname: `/game/${game.id}`
              }}
            >
              <div className="h-48 my-4 flex items-center justify-center bg-gray-50 hover:bg-yellow-50 hover:border-slate-100 hover:border-2 rounded-md"></div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
