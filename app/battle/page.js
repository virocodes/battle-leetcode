'use client'
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Split from 'react-split';

// Dynamically import the CodeMirrorEditor with ssr: false
const CodeMirrorEditor = dynamic(() => import('../components/CodeMirrorEditor'), {
    ssr: false,
});

export default function Battle() {
    const [code, setCode] = useState('hello world');
    return (
        // <div className="h-screen grid grid-rows-[200px_1fr] grid-cols-3 gap-4 p-4">
        <Split className="split h-screen" direction="horizontal" sizes={[75, 25]} minSize={100}>
            <Split direction="vertical" sizes={[30, 70]} minSize={100}>
                {/* Top Left Section - Problem Statement */}
                <div className="col-span-2 bg-blue-300 p-4 overflow-auto">
                    {/* <h1 className="text-center text-white p-4">Top Right Section</h1> */}

                    <h1 className="text-white text-2xl font-bold mb-2 ">Problem Statement</h1>
                    <div className="bg-white p-4 rounded shadow-lg text-black">
                        <p>
                            Given an array of integers, return the indices of the two numbers
                            such that they add up to a specific target.
                        </p>
                        <p className="mt-2">
                            You may assume that each input would have exactly one solution, and
                            you may not use the same element twice.
                        </p>
                        <p className="mt-2 font-semibold">Example:</p>
                        <pre className="bg-gray-100 p-2 rounded">
                            <code>
                                Input: nums = [2, 7, 11, 15], target = 9{"\n"}
                                Output: [0, 1]{"\n"}
                                Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                            </code>
                        </pre>
                    </div>
                </div>



                {/* Bottom Left Section */}
                <div className="col-span-2 bg-red-300 p-4">
                    <h1 className="text-white text-2xl font-bold mb-2">Code Editor</h1>
                    <CodeMirrorEditor code={code} setCode={setCode} />
                </div>

            </Split>

            <div className="flex flex-col">
                {/* <Split className="split flex-grow" direction="vertical" sizes={[30, 70]} minSize={100}> */}
                    {/* Top Right Section */}
                    <div className="bg-green-300 p-4">
                        <h1 className="text-center text-white p-4">Top Right Section</h1>
                    </div>

                    {/* Bottom Right Section */}
                    <div className="bg-yellow-300 p-4 h-full">
                        <h1 className="text-white text-2xl font-bold mb-2">Terminal</h1>
                    </div>
                {/* </Split> */}
            </div>
        </Split>

    );
}
