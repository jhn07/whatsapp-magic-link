import React from 'react';

// Функция для генерации фиксированных позиций звезд
const generateStarPositions = (count: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      left: `${(i % 20) * 5}%`,
      top: `${Math.floor(i / 20) * 5}%`,
      size: `${(i % 3) + 1}px`,
      delay: `${(i % 5)}s`,
      duration: `${(i % 3) + 2}s`,
    });
  }
  return positions;
};

// Предварительно генерируем позиции звезд
const starPositions = generateStarPositions(200);

export const SpaceBackground = () => {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Звездное поле */}
      <div className="absolute inset-0">
        {starPositions.map((position, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: position.left,
              top: position.top,
              width: position.size,
              height: position.size,
              animationDelay: position.delay,
              animationDuration: position.duration,
            }}
          />
        ))}
      </div>

      {/* Планета Марс (центральная) */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 shadow-2xl relative animate-[spin_20s_linear_infinite]">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-300 via-red-400 to-orange-500 opacity-80">
            <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-red-600 opacity-60"></div>
            <div className="absolute bottom-6 right-4 w-2 h-2 rounded-full bg-orange-700 opacity-70"></div>
            <div className="absolute top-8 right-6 w-4 h-2 rounded-full bg-red-700 opacity-50"></div>
          </div>
          <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-orange-200 opacity-30 blur-sm"></div>
        </div>
      </div>

      {/* Планета Юпитер (левый верх) */}
      <div className="absolute top-20 left-16 animate-[float_6s_ease-in-out_infinite]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 shadow-xl relative opacity-70 animate-[spin_15s_linear_infinite]">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-300 opacity-90">
            <div className="absolute top-2 left-3 w-12 h-1 rounded-full bg-amber-600 opacity-40"></div>
            <div className="absolute top-4 left-2 w-14 h-1 rounded-full bg-orange-600 opacity-50"></div>
            <div className="absolute bottom-3 left-4 w-10 h-1 rounded-full bg-yellow-600 opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Планета Сатурн (правый верх) */}
      <div className="absolute top-32 right-20 animate-[float_8s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}>
        <div className="relative animate-[spin_25s_linear_infinite]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-400 shadow-lg opacity-60">
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-300 opacity-80"></div>
          </div>
          {/* Кольца Сатурна */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-yellow-300 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-amber-400 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Планета Нептун (левый низ) */}
      <div className="absolute bottom-24 left-24 animate-[float_7s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 shadow-lg opacity-50 animate-[spin_18s_linear_infinite]">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600 opacity-90">
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-800 opacity-60"></div>
            <div className="absolute bottom-2 left-3 w-3 h-1 rounded-full bg-blue-900 opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Малая планета (правый низ) */}
      <div className="absolute bottom-40 right-32 animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: '3s' }}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 shadow-md opacity-40 animate-[spin_12s_linear_infinite]">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600 opacity-80"></div>
        </div>
      </div>

      {/* Венера (левый центр) */}
      <div className="absolute top-1/3 left-8 animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-300 to-yellow-500 shadow-lg opacity-45 animate-[spin_10s_linear_infinite]">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-300 via-orange-200 to-yellow-400 opacity-90"></div>
        </div>
      </div>

      {/* Световые эффекты */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-cyan-400 rounded-full opacity-10 blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

