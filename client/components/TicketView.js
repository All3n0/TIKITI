'use client';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

export default function TicketView({ event, order, ticketData }) {
  const ticketRef = useRef();

  const downloadTicket = () => {
    html2canvas(ticketRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = `Ticket_${event.title.replace(/\s/g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-start pt-16 px-6">
      <div
        ref={ticketRef}
        className="bg-white text-gray-800 w-full max-w-4xl aspect-[3/1] rounded-xl border-4 border-orange-600 shadow-2xl flex p-8 relative overflow-hidden font-mono"
      >
        {/* Left section */}
        <div className="w-2/3 pr-6 border-r border-dashed border-orange-500">
          <h1 className="text-3xl font-extrabold text-orange-600">{event.title}</h1>
          <p className="text-sm mt-1 text-gray-600">{event.venue?.name}, {event.venue?.address}</p>
          <p className="text-sm">{new Date(event.start_datetime).toLocaleDateString()} • {new Date(event.start_datetime).toLocaleTimeString()}</p>

          <div className="mt-6 space-y-1">
            <p><strong>Attendee:</strong> {ticketData.attendee_name}</p>
            <p><strong>Email:</strong> {ticketData.attendee_email}</p>
            <p><strong>Type:</strong> {ticketData.ticket_type}</p>
            <p><strong>Price:</strong> KSh {ticketData.price?.toLocaleString() || "N/A"}</p>
            <p><strong>Serial:</strong> {ticketData.serial}</p>
          </div>
        </div>

        {/* Right section with QR */}
        <div className="w-1/3 flex flex-col items-center justify-between pl-6">
          <img src={`http://localhost:5557/${ticketData.qr_code_path}`} alt="QR Code" className="w-28 h-28 mb-4" />
          <p className="text-xs text-gray-500">Scan for entry</p>
        </div>

        {/* Download button overlay */}
        <button
          onClick={downloadTicket}
          className="absolute bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md text-sm"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
}
