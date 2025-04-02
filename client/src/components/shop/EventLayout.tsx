import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { events } from "./countdown";
import EventCard from "./EventCard";

const EventsLayout: React.FC = () => {
  return (
    <div className="bg-purple-900 text-white font-sans min-h-screen flex flex-col items-center">
      <div className="max-w-7xl w-full py-10 px-4">
        <h1 className="text-2xl font-bold text-center mb-8">
          <FontAwesomeIcon icon={faStar} className="text-yellow-400" /> Próximos
          Eventos Especiales
        </h1>
        <div className="space-y-6 w-full">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsLayout;
