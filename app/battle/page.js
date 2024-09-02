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
import EditorFooter from '@/app/components/EditorFooter';

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

    const [activeTestCaseId, setActiveTestCaseId] = useState(0);
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

    const handleSubmit = async () => {
        // if (!user) {
        // 	toast.error("Please login to submit your code", {
        // 		position: "top-center",
        // 		autoClose: 3000,
        // 		theme: "dark",
        // 	});
        // 	return;
        // }
        // try {
        // 	userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
        // 	const cb = new Function(`return ${userCode}`)();
        // 	const handler = problems[pid].handlerFunction;

        // 	if (typeof handler === "function") {
        // 		const success = handler(cb);
        // 		if (success) {
        // 			toast.success("Congrats! All tests passed!", {
        // 				position: "top-center",
        // 				autoClose: 3000,
        // 				theme: "dark",
        // 			});
        // 			setSuccess(true);
        // 			setTimeout(() => {
        // 				setSuccess(false);
        // 			}, 4000);

        // 			const userRef = doc(firestore, "users", user.uid);
        // 			await updateDoc(userRef, {
        // 				solvedProblems: arrayUnion(pid),
        // 			});
        // 			setSolved(true);
        // 		}
        // 	}
        // } catch (error) {
        // 	console.log(error.message);
        // 	if (
        // 		error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")
        // 	) {
        // 		toast.error("Oops! One or more test cases failed", {
        // 			position: "top-center",
        // 			autoClose: 3000,
        // 			theme: "dark",
        // 		});
        // 	} else {
        // 		toast.error(error.message, {
        // 			position: "top-center",
        // 			autoClose: 3000,
        // 			theme: "dark",
        // 		});
        // 	}
        // }
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
            <div className='flex flex-col '>
                <Split className='flex-grow dark:bg-dark-layer-1 dark:text-white' direction="vertical" sizes={[70, 30]} minSize={100}>
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

                    {/* Test Cases */}
                    <div className='w-full px-5 overflow-auto'>
                        {/* testcase heading */}
                        <div className='flex h-10 items-center space-x-6'>
                            <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                                <div className='text-sm font-medium leading-5 text-white'>Testcases</div>
                                <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
                            </div>
                        </div>

                        <div className='flex'>
                            {problem.examples.map((example, index) => (
                                <div
                                    className='mr-2 items-start mt-2 '
                                    key={example.id}
                                    onClick={() => setActiveTestCaseId(index)}
                                >
                                    <div className='flex flex-wrap items-center gap-y-4'>
                                        <div
                                            className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
                                        >
                                            Case {index + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='font-semibold my-4'>
                            <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                            <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                                {problem.examples[activeTestCaseId].inputText}
                            </div>
                            <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                            <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
                                {problem.examples[activeTestCaseId].outputText}
                            </div>
                        </div>
                    </div>
                </Split>
                <EditorFooter handleSubmit={handleSubmit} />
            </div>

        </Split>

    );
}
