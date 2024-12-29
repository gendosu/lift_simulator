import React, { useState, useEffect } from 'react';

const ElevatorSimulator = () => {
  const floorConfig = {
    'R': 7,
    '5': 6,
    '4': 5,
    '3': 4,
    '2': 3,
    '1': 2,
    'B1': 1
  };

  const [currentFloor, setCurrentFloor] = useState('1');
  const [targetFloor, setTargetFloor] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isDoorMoving, setIsDoorMoving] = useState(false);
  
  const floors = ['R', 5, 4, 3, 2, 1, 'B1'];
  const elevatorHeight = 384; // シャフトの高さから余白を引いた値
  const elevatorCarHeight = 64; // エレベーターの高さ
  const shaftPadding = 16; // シャフトの上下の余白
  
  const getFloorDisplay = (floor) => {
    if (floor === 'B1' || floor === 'R') return floor;
    return `${floor}F`;
  };

  const calculateElevatorPosition = () => {
    const totalFloors = Object.keys(floorConfig).length;
    const movableHeight = elevatorHeight - elevatorCarHeight; // エレベーターが動ける実際の高さ
    const floorHeight = movableHeight / (totalFloors - 1);
    const currentFloorValue = floorConfig[currentFloor];
    
    // Rが一番上、B1が一番下になるように計算
    const position = shaftPadding + ((totalFloors - currentFloorValue) * floorHeight);
    return position;
  };

  const handleFloorClick = (floor) => {
    if (isMoving || floor === currentFloor) return;
    if (isDoorOpen) {
      handleDoorControl(false);
      setTimeout(() => {
        setTargetFloor(floor);
        setIsMoving(true);
      }, 1500);
    } else {
      setTargetFloor(floor);
      setIsMoving(true);
    }
  };

  const handleDoorControl = (open) => {
    if (isMoving || isDoorMoving || open === isDoorOpen) return;
    setIsDoorMoving(true);
    setTimeout(() => {
      setIsDoorOpen(open);
      setIsDoorMoving(false);
    }, 1000);
  };

  const getNextFloor = (current, target) => {
    const currentValue = floorConfig[current];
    const targetValue = floorConfig[target];
    
    if (currentValue === targetValue) return null;
    const difference = targetValue - currentValue;
    const direction = difference > 0 ? 1 : -1;
    
    const currentIndex = floors.indexOf(current);
    const nextIndex = currentIndex - direction;
    return floors[nextIndex];
  };

  useEffect(() => {
    if (targetFloor === null || !isMoving) return;

    const moveElevator = () => {
      const nextFloor = getNextFloor(currentFloor, targetFloor);
      
      if (nextFloor === null) {
        setIsMoving(false);
        setTargetFloor(null);
        return;
      }
      
      setCurrentFloor(nextFloor);
    };

    const timer = setTimeout(moveElevator, 1000);
    return () => clearTimeout(timer);
  }, [targetFloor, currentFloor, isMoving]);

  return (
    <div className="flex h-screen bg-gray-100 p-4">
      <div className="flex flex-col mr-8">
        {/* 現在階表示 */}
        <div className="bg-orange-500 p-4 mb-4 text-white font-bold w-48 h-20 flex items-center justify-center">
          <div className="text-4xl">{getFloorDisplay(currentFloor)}</div>
        </div>
        
        {/* フロアボタン */}
        <div className="flex flex-wrap gap-4 mb-8 w-36">
          {floors.map(floor => (
            <button
              key={floor}
              onClick={() => handleFloorClick(floor)}
              className={`w-16 h-16 ${
                currentFloor === floor
                  ? 'bg-blue-500'
                  : targetFloor === floor
                  ? 'bg-yellow-500'
                  : 'bg-gray-300'
              } text-white font-bold rounded-lg hover:opacity-80 transition-colors`}
            >
              {getFloorDisplay(floor)}
            </button>
          ))}
        </div>

        {/* ドア開閉ボタン */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleDoorControl(true)}
            className={`w-16 h-16 ${isDoorOpen ? 'bg-blue-500' : 'bg-gray-300'} 
              text-white font-bold rounded-lg hover:opacity-80 transition-colors`}
            disabled={isMoving || isDoorMoving}
          >
            開
          </button>
          <button
            onClick={() => handleDoorControl(false)}
            className={`w-16 h-16 ${!isDoorOpen ? 'bg-blue-500' : 'bg-gray-300'}
              text-white font-bold rounded-lg hover:opacity-80 transition-colors`}
            disabled={isMoving || isDoorMoving}
          >
            閉
          </button>
        </div>
      </div>

      {/* エレベーターシャフト */}
      <div className="relative w-32 h-96 bg-gray-200">
        {/* シャフト内の階数マーク */}
        <div className="absolute left-0 top-0 h-full w-full flex flex-col justify-between py-4">
          {floors.map((floor, index) => (
            <div key={floor} className="w-3 h-0.5 bg-gray-300"/>
          ))}
        </div>
        {/* エレベーター */}
        <div
          className="absolute w-24 h-16 bg-blue-300 left-4 overflow-hidden transition-all duration-1000"
          style={{
            top: `${calculateElevatorPosition()}px`,
          }}
        >
          {/* 左ドア */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full bg-blue-500 transition-all duration-1000"
            style={{
              transform: `translateX(${isDoorOpen ? '-100%' : '0'})`,
            }}
          />
          {/* 右ドア */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full bg-blue-500 transition-all duration-1000"
            style={{
              transform: `translateX(${isDoorOpen ? '100%' : '0'})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ElevatorSimulator;