'use client'
import { useUser } from "@clerk/clerk-react";
import { push, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { database } from '../firebase';
export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    const newRoomRef = push(ref(database, 'rooms'));
    const newRoomId = newRoomRef.key;
    router.push(`/battle/${newRoomId}`);
  }

  const handleJoinRoom = () => {
    router.push(`/battle/${roomId}`);
   
    
    
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-3xl font-bold">Battle Leetcode</h1>
      <h2 className="text-2xl">Welcome, {user?.fullName}</h2>
      <button onClick={handleCreateRoom} className="text-2xl font-bold text-blue-500 border border-blue-500 rounded px-4 py-2 hover:bg-blue-500 hover:text-white">Create Room</button>
      <p className="text-2xl">or</p>
      <input
        className="text-2xl font-bold text-blue-500 border border-blue-500 rounded px-4 py-2"
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom} className="text-2xl font-bold text-blue-500 border border-blue-500 rounded px-4 py-2 hover:bg-blue-500 hover:text-white">Join Room</button>
    </div>
    
  );
}
