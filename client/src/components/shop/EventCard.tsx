import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGift } from "@fortawesome/free-solid-svg-icons";
import { calculateTimeLeft } from "./countdown";

const EventCard: React.FC<{
  event: {
    title: string;
    description: string;
    startTime: Date;
    rewards: string;
  };
}> = ({ event }) => {
  const [reminded, setReminded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(event.startTime));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(event.startTime));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const handleRemindMe = () => {
    localStorage.setItem(
      `reminder-${event.title}`,
      event.startTime.toISOString()
    );
    setReminded(true);
  };

  const renderTimeLeft = () => {
    return (
      <span>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
        {timeLeft.seconds}s
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-pink-500 p-7 w-full flex flex-col md:flex-row justify-between items-start md:items-center rounded-xl relative">
      <button
        onClick={handleRemindMe}
        disabled={reminded}
        className={`absolute top-4 right-4 bg-yellow-500 text-purple-900 font-bold py-2 px-4 rounded-[0.5vw] transition-all ${
          reminded ? "bg-gray-400 cursor-not-allowed" : "hover:bg-yellow-600"
        }`}
      >
        {reminded ? "Reminder Set" : "Recordar"}
      </button>
      <div className="mb-4 md:mb-0 flex-1">
        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
        <p className="text-md">{event.description}</p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
          <div className="flex items-center space-x-1 bg-purple-800 py-1 px-2 rounded-[0.45vw] border border-purple-500">
            <FontAwesomeIcon icon={faClock} />
            <span>Comienza en: {renderTimeLeft()}</span>
          </div>
          <div className="flex items-center space-x-1 bg-purple-800 py-1 px-2 rounded-[0.45vw] border border-purple-500">
            <FontAwesomeIcon icon={faGift} />
            <span>{event.rewards}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
