'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/clerk-react';
import { ref, push, update } from 'firebase/database';
import { database } from '@/firebase';
import dynamic from 'next/dynamic';
import Split from 'react-split';

import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";

import { twoSum } from '@/app/utils/problems/two-sum';
import Image from 'next/image';
import { onValue } from 'firebase/database';

function HealthBar({ label, health }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="font-bold">{label}</span>
                <span className="font-bold">{health}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${health}%` }}></div>
            </div>
        </div>
    );
}

export default function Battle() {
    const { roomId } = useParams();
    const searchParams = useSearchParams();
    const { isSignedIn, user, isLoaded } = useUser();
    const userName = user?.fullName
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesOpen, setMessagesOpen] = useState(true);
    const messagesEndRef = useRef(null);
    const [gameFull, setGameFull] = useState(false);

    const [players, setPlayers] = useState([]);
    const [playerCount, setPlayerCount] = useState(0);

    useEffect(() => {
        const playersRef = ref(database, `rooms/${roomId}/players`);
        update(playersRef, {
            [userName]: true
        })
        const unsubscribe = onValue(playersRef, (snapshot) => {
            if (snapshot.exists()) {
              const players = snapshot.val();
              setPlayerCount(Object.keys(players).length);
              setPlayers(Object.keys(players));
            } else {
              setPlayerCount(0);
            }
        });
        
        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

    useEffect(() => {
        if (!roomId) return;
        const messagesRef = ref(database, `rooms/${roomId}/messages`);
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const chatMessages = data ? Object.values(data) : []
            setMessages(chatMessages);
        })
    }, [roomId]);

    const handleSendMessage = () => {
        if (!roomId) return;
        if (message === '') return;
        const messagesRef = ref(database, `rooms/${roomId}/messages`);
        push(messagesRef, { 
            user: user.fullName,
            text: message,
            timestamp: Date.now()
         });
        setMessage('');
    }

    const [code, setCode] = useState('hello world');
    const [playerHealth, setPlayerHealth] = useState(63);
    const [opponentHealth, setOpponentHealth] = useState(50);
    const [problem, setProblem] = useState(twoSum);

    return (
        <Split className="split h-screen dark:bg-dark-layer-1 dark:text-white" direction="horizontal" sizes={[50, 50]} minSize={100}>
            
            

            {/* Left */}
            <div className="p-4 overflow-auto">
                <div>Player count: {playerCount}, Players: {players?.map((player, index) => <span key={index}> {player} </span>)}</div>
                {/* Battle Status */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-center text-2xl font-bold mb-4">Battle Status</h1>
                    <HealthBar label="Player" health={playerHealth} />
                    <HealthBar label="Opponent" health={opponentHealth} />
                </div>

                {/* Problem Section */}
                <h1 className="text-2xl font-bold ">{problem?.title}</h1>
                <div className="p-4">

                    {/* Problem Statement */}
                    <div dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />

                    {/* Exaples */}
                    <div className='mt-4'>
                        {problem.examples.map((example, index) => (
                            <div key={example.id}>
                                <p className='font-medium '>Example {index + 1}: </p>
                                {example.img && <Image src={example.img} alt='' className='mt-3' />}
                                <div className='example-card'>
                                    <pre>
                                        <strong className=''>Input: </strong> {example.inputText}
                                        <br />
                                        <strong>Output:</strong>
                                        {example.outputText} <br />
                                        {example.explanation && (
                                            <>
                                                <strong>Explanation:</strong> {example.explanation}
                                            </>
                                        )}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Constraints */}
                    <div className='my-8 pb-4'>
                        <div className='text-sm font-medium'>Constraints:</div>
                        <ul className='ml-5 list-disc '>
                            <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
                        </ul>
                    </div>

                </div>


                <div className="fixed bottom-4 right-4 z-50">
                    {messagesOpen ? (
                        <div className="w-72 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
                        <div
                            className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center cursor-pointer"
                            onClick={() => setMessagesOpen(false)}
                        >
                            <span className="font-bold">Chatbot</span>
                            <button className="text-lg font-bold">_</button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-2">
                            {messages.map((message, index) => (
                            <div>
                            <strong className='text-black'>{message.user}</strong>
                            <div
                                key={index}
                                className={`p-2 rounded-lg max-w-[80%] ${
                                message.user === userName
                                    ? 'bg-blue-500 text-white self-end'
                                    : 'bg-gray-200 text-black self-start'
                                }`}
                            >
                                
                                {message.text}
                            </div>
                            <div ref={messagesEndRef}></div>
                            </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-300 p-2 flex">
                            <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1 p-2 border rounded-lg border-gray-300 mr-2 text-black"
                            placeholder="Type a message..."
                            />
                            <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white rounded-lg px-4 py-2"
                            >
                            Send
                            </button>
                        </div>
                        </div>
                    ) : (
                        <div
                        className="w-24 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() => setMessagesOpen(true)}
                        >
                        Chat
                        </div>
                    )}
                    </div>








            </div>

            {/* Right */}
            <Split className='dark:bg-dark-layer-1 dark:text-white' direction="vertical" sizes={[70, 30]} minSize={100}>


                {/* Code Editor */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-2xl font-bold mb-2">Code Editor</h1>
                    <CodeMirror
                        value={code}
                        theme={vscodeDark}
                        onChange={(editor, data, value) => {
                            setCode(value);
                        }}
                        extensions={[javascript()]}
                    />
                </div>

                {/* Terminal */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-2xl font-bold mb-2">Terminal</h1>
                </div>
            </Split>

        </Split>

    );
}
