'use client';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

export default function TicketView({ event, order, ticketData, onClose }) {
  const ticketRef = useRef();

  const downloadTicket = () => {
    html2canvas(ticketRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = `Ticket_${event.title.replace(/\s/g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  // Format date and time from the actual event data
  const eventDate = new Date(event.start_datetime);
  const formattedDate = eventDate.toLocaleString('default', { 
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();
  
  const dayOfWeek = eventDate.toLocaleString('default', { weekday: 'long' });
  const doorOpenTime = new Date(event.start_datetime).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  }).replace(':', '.');

  return (
    // <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4 backdrop-blur">
     <div
  ref={ticketRef}
className="bg-black text-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col md:flex-row p-6 relative font-sans h-auto"
>

        {/* Close button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold z-10"
          aria-label="Close ticket"
        >
          &times;
        </button>

        {/* Left section - Event details */}
        <div className="w-full md:w-2/3 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-dashed border-orange-500 flex flex-col">
          {/* Header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
              {event.title.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-orange-500 font-bold">NIGHT EVENT</span>
              <span className="text-gray-400">on {dayOfWeek}</span>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 grid grid-cols-2 gap-4 md:gap-6">
            {/* Left column */}
            <div>
              <div className="mb-4 md:mb-6">
                <h3 className="text-xs md:text-sm text-gray-400 mb-1">ENTRIES</h3>
                <p className="text-lg md:text-xl font-bold">
                  ${event.ticket_types?.[0]?.price || '50'}
                </p>
              </div>
              
              <div>
                <h3 className="text-xs md:text-sm text-gray-400 mb-1">GUEST SINGER</h3>
                <ul className="space-y-1">
                  {/* Display performers from event data if available */}
                  {event.performers?.length > 0 ? (
                    event.performers.map((performer, index) => (
                      <li key={index} className="font-medium">{performer}</li>
                    ))
                  ) : (
                    <>
                      <li className="font-medium">DJ BOOS</li>
                      <li className="font-medium">DJ SONIKA</li>
                    </>
                  )}
                </ul>
                <p><span className="text-gray-400">Transaction:</span> {order?.transaction_reference}</p>

              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col items-end">
              <div className="text-right mb-4 md:mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{formattedDate}</h2>
              </div>
              
              <div className="text-right">
                <h3 className="text-xs md:text-sm text-gray-400 mb-1">DOOR OPEN</h3>
                <p className="text-lg md:text-xl font-bold">{doorOpenTime}</p>
              </div>
            </div>
          </div>

          {/* Attendee info at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-700 text-xs md:text-sm">
            <p><span className="text-gray-400">Attendee:</span> {ticketData.attendee_name}</p>
            <p><span className="text-gray-400">Serial:</span> {ticketData.serial}</p>
          </div>
        </div>

        {/* Right section with QR */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center md:justify-between pt-4 md:pt-0 md:pl-6">
          <div className="bg-white p-2 rounded">
            <img 
              src={`https://servertikiti-production.up.railway.app/${ticketData.qr_code_path}`} 
              alt="QR Code" 
              className="w-24 h-24 md:w-32 md:h-32" 
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Scan for entry</p>
          
          <div className="text-center mt-4">
            <p className="text-xs md:text-sm text-gray-400">Ticket Type</p>
            <p className="text-lg md:text-xl font-bold pb-9"><strong></strong> {ticketData.ticket_type}</p>
          </div>
        </div>

        {/* Download button overlay */}
        <button
          onClick={downloadTicket}
          className="absolute bottom-4 right-12 bg-orange-600 hover:bg-orange-700 text-white py-1 px-3 md:py-2 md:px-4 rounded-md text-xs md:text-sm"
        >
          Download Ticket
        </button>
        {/* Ticket Navigation
<div className="absolute bottom-4 left-12 flex items-center gap-3">
  <button
    onClick={onPrev}
    className="bg-gray-800 hover:bg-gray-700 text-white py-1 px-3 md:py-2 md:px-4 rounded-md text-xs md:text-sm"
  >
    Previous
  </button>
  <span className="text-gray-400 text-xs md:text-sm">
    Ticket {index + 1} of {total}
  </span>
  <button
    onClick={onNext}
    className="bg-gray-800 hover:bg-gray-700 text-white py-1 px-3 md:py-2 md:px-4 rounded-md text-xs md:text-sm"
  >
    Next
  </button>
</div> */}

      </div>
    // </div>
  );
}