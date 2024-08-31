'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Split from 'react-split';

// Dynamically import the CodeMirrorEditor with ssr: false
const CodeMirrorEditor = dynamic(() => import('../components/CodeMirrorEditor'), {
    ssr: false,
});

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
    const [code, setCode] = useState('hello world');
    const [playerHealth, setPlayerHealth] = useState(63);
    const [opponentHealth, setOpponentHealth] = useState(50);

    return (
        <Split className="split h-screen" direction="horizontal" sizes={[50, 50]} minSize={100}>
            {/* Left - Problem Statement */}
            <div className="col-span-2 p-4 overflow-auto">

                <h1 className="text-2xl font-bold mb-2 ">Problem Statement</h1>
                <div className="p-4">
                    <p>
                        Given an array of integers, return the indices of the two numbers
                        such that they add up to a specific target.
                    </p>
                    <p className="mt-2">
                        You may assume that each input would have exactly one solution, and
                        you may not use the same element twice.
                    </p>
                    <p className="mt-2 font-semibold">Example:</p>
                    <pre className="bg-gray-100 p-2 rounded overflow-auto">
                        <code>
                            Input: nums = [2, 7, 11, 15], target = 9{"\n"}
                            Output: [0, 1]{"\n"}
                            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                        </code>
                    </pre>
                </div>
            </div>

            {/* Right */}
            <Split direction="vertical" sizes={[20, 70, 10]} minSize={200}>
                {/* Battle Status */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-center text-2xl font-bold mb-4">Battle Status</h1>
                    <HealthBar label="Player" health={playerHealth} />
                    <HealthBar label="Opponent" health={opponentHealth} />
                </div>

                {/* Code Editor */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-2xl font-bold mb-2">Code Editor</h1>
                    <CodeMirrorEditor code={code} setCode={setCode} />
                </div>

                {/* Terminal */}
                <div className="w-full p-4 overflow-auto">
                    <h1 className="text-2xl font-bold mb-2">Terminal</h1>
                </div>
            </Split>

        </Split>

    );
}
