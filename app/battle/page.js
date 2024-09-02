'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Split from 'react-split';

import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';
import { javascript } from "@codemirror/lang-javascript";

import { twoSum } from '@/app/utils/problems/two-sum';
import Image from 'next/image';

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
    const [playerHealth, setPlayerHealth] = useState(63);
    const [opponentHealth, setOpponentHealth] = useState(50);

    const [problem, setProblem] = useState(twoSum);
    
    const [code, setCode] = useState(problem.starterCode);
    const [theme, setTheme] = useState(githubLight);

    // Load code from local storage when the component mounts
    useEffect(() => {
        const savedCode = localStorage.getItem('userCode');
        if (savedCode) {
            setCode(savedCode);
        }

        // Detect the user's preferred color scheme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? vscodeDark : githubLight);

        // Listen for changes in the user's color scheme
        const handleChange = (e) => {
            setTheme(e.matches ? vscodeDark : githubLight);
        };
        mediaQuery.addEventListener('change', handleChange);

        // Cleanup listener on unmount
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Save code to local storage whenever it changes
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        localStorage.setItem('userCode', newCode);
    };

    return (
        <Split className="split h-screen dark:bg-dark-layer-1 dark:text-white" direction="horizontal" sizes={[50, 50]} minSize={100}>

            {/* Left */}
            <div className="p-4 overflow-auto">
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
            </div>

            {/* Right */}
            <Split className='dark:bg-dark-layer-1 dark:text-white' direction="vertical" sizes={[70, 30]} minSize={100}>


                {/* Code Editor */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-2xl font-bold mb-2">Code Editor</h1>
                    <CodeMirror
                        value={code}
                        theme={theme}
                        onChange={(editor, data, value) => {
                            handleCodeChange(editor);
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
