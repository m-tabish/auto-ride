"use client";

import { Users, Copy, ShareNetwork, X } from "@phosphor-icons/react";
import { useState } from "react";

const mockPassengers = [
  { id: 1, name: "Rahul D.", color: "bg-orange-500" },
  { id: 2, name: "Sneha M.", color: "bg-teal-500" },
  { id: 3, name: "Kabir", color: "bg-amber-500" },
  { id: 4, name: "You", color: "bg-white" },
];

export function RideSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute right-16 top-32 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#1a0f0a]/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all hover:scale-110 hover:bg-[#2c170d]"
        title="View Passengers"
      >
        <div className="relative">
          <Users size={24} weight="fill" className="text-amber-500" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md">
            {mockPassengers.length}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="absolute right-16 top-32 z-50 w-[280px] rounded-3xl border border-white/10 bg-[#1a0f0a]/60 p-5 shadow-2xl backdrop-blur-xl transition-all">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">Shared Auto</h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1 text-[9px] font-mono font-bold text-white tracking-wider">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></div>
            LIVE
          </span>
          <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10">
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>

      {/* Room Code */}
      <div className="mb-6 rounded-2xl border border-white/5 bg-black/40 p-4">
        <p className="mb-1 text-[9px] font-bold tracking-widest text-white/50 uppercase">Room Code</p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-2xl font-black tracking-widest text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">X9Y-2B4</span>
          <button className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all hover:scale-105 active:scale-95">
            <Copy size={18} />
          </button>
        </div>
      </div>

      {/* Passengers */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/80">
          <Users size={16} weight="fill" className="text-amber-500" />
          Passengers ({mockPassengers.length}/6)
        </div>
        <div className="flex flex-col gap-2.5">
          {mockPassengers.map((p) => (
            <div key={p.id} className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-2 transition-all hover:bg-white/10 hover:border-white/10 cursor-pointer">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${p.color} text-sm font-bold ${p.id === 4 ? 'text-black' : 'text-black'}`}>
                {p.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white/90 group-hover:text-white">{p.name}</span>
                {p.id === 4 && <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider">Driver</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Invite Button */}
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]">
        <ShareNetwork size={18} weight="bold" />
        Invite Friends
      </button>
    </div>
  );
}
