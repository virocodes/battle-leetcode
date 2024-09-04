'use client'; // This directive is necessary for components that use hooks and need to run on the client side.

import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import HealthBar from '../components/HealthBar';
import { fetchRandomProblem } from '../utils/problems'; // Utility function to fetch problems
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs'; // Clerk authentication hook
import { db } from '../firebase/firebaseConfig'; // Firebase Firestore configuration
import { collection, addDoc } from "firebase/firestore"; 

export default function Battle() {
    const [code, setCode] = useState('');
    const [playerHealth, setPlayerHealth] = useState(100);
    const [opponentHealth, setOpponentHealth] = useState(100);
    const [problem, setProblem] = useState(null);
    const { userId } = useAuth();

    useEffect(() => {
        const getProblem = async () => {
            const problemData = await fetchRandomProblem();
            setProblem(problemData);
        };
        getProblem();
    }, []);

    const submitCode = async () => {
        const isCorrect = Math.random() > 0.5; // Simulated correctness check
        if (isCorrect) {
            setOpponentHealth((prevHealth) => Math.max(prevHealth - 10, 0));
        } else {
            setPlayerHealth((prevHealth) => Math.max(prevHealth - 10, 0));
        }

        if (userId && problem) {
            const battleResult = {
                userId: userId,
                problemId: problem.title,
                playerHealth,
                opponentHealth,
                timestamp: new Date().toISOString(),
            };
            try {
                await addDoc(collection(db, "battles"), battleResult);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
    };

    if (!problem) return <div>Loading...</div>;

    return (
        <Split className="split h-screen dark:bg-dark-layer-1 dark:text-white" direction="horizontal" sizes={[50, 50]} minSize={100}>
            {/* Left Panel */}
            <div className="p-4 overflow-auto">
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-center text-2xl font-bold mb-4">Battle Status</h1>
                    <HealthBar label="Player" health={playerHealth} />
                    <HealthBar label="Opponent" health={opponentHealth} />
                </div>

                {/* Problem Section */}
                <h1 className="text-2xl font-bold">{problem?.title}</h1>
                <div className="p-4">
                    {/* Problem Statement */}
                    <div dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />

                    {/* Examples */}
                    <div className='mt-4'>
                        {problem.examples.map((example, index) => (
                            <div key={index}>
                                <p className='font-medium'>Example {index + 1}:</p>
                                <pre>
                                    <strong>Input:</strong> {example.inputText}
                                    <br />
                                    <strong>Output:</strong> {example.outputText}
                                    <br />
                                    {example.explanation && (
                                        <>
                                            <strong>Explanation:</strong> {example.explanation}
                                        </>
                                    )}
                                </pre>
                            </div>
                        ))}
                    </div>

                    {/* Constraints */}
                    <div className='my-8 pb-4'>
                        <div className='text-sm font-medium'>Constraints:</div>
                        <ul className='ml-5 list-disc'>
                            <li>{problem.constraints}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <Split className='dark:bg-dark-layer-1 dark:text-white' direction="vertical" sizes={[70, 30]} minSize={100}>
                {/* Code Editor */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-2xl font-bold mb-2">Code Editor</h1>
                    <CodeMirror
                        value={code}
                        theme={vscodeDark}
                        onChange={(value) => setCode(value)}
                        extensions={[javascript()]}
                    />
                </div>

                {/* Terminal */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-2xl font-bold mb-2">Terminal</h1>
                    <button onClick={submitCode} className="px-4 py-2 bg-blue-500 text-white rounded">
                        Submit Code
                    </button>
                </div>
            </Split>
        </Split>
    );
}
