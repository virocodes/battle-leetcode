'use client'
import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from '@/app/components/EditorFooter';
import toast, { Toaster } from 'react-hot-toast';


export default function Playground({problem, user}) {

    // const [problem, setProblem] = useState(problem);
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
        if (!user) {
            console.log("Please login to submit your code");
            toast.error("Please login to submit your code", {
                position: "top-center",
                duration: 3000,
            });
        	return;
        }
        try {
        	setCode(code.slice(code.indexOf(problem.starterFunctionName)));
        	const cb = new Function(`return ${code}`)();
        	const handler = problem.handlerFunction;

        	if (typeof handler === "function") {
        		const success = handler(cb);
        		if (success) {
                    console.log("Test case passed");
                    toast.success("Congrats! All tests passed!", {
                        position: "top-center",
                        duration: 3000,
                    });
        			// setSuccess(true);
        			// setTimeout(() => {
        			// 	setSuccess(false);
        			// }, 4000);

        			// const userRef = doc(firestore, "users", user.uid);
        			// await updateDoc(userRef, {
        			// 	solvedProblems: arrayUnion(pid),
        			// });
        			// setSolved(true);
        		}
        	}
        } catch (error) {
            // show errors under test cases section
        	console.log(error.message);
        	if (
        		error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")
        	) {
                console.log("Test case failed");
                toast.error("Oops! One or more test cases failed", {
                    position: "top-center",
                    duration: 3000,
                });
        	} else {
                console.log(error.message);
                toast.error(error.message, {
                    position: "top-center",
                    duration: 3000,
                });
        	}
        }
    };

    return (
        <div className='flex flex-col '>
            <Toaster />
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
                            <div className='text-sm font-medium leading-5 dark:text-white'>Testcases</div>
                            <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none dark:bg-white bg-black' />
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
                                        className={`font-medium items-center transition-all focus:outline-none inline-flex dark:bg-dark-fill-3 bg-gray-200 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "dark:text-white" : "text-gray-500"}
									`}
                                    >
                                        Case {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='font-semibold my-4'>
                        <p className='text-sm font-medium mt-4 dark:text-white'>Input:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] dark:bg-dark-fill-3 bg-gray-200 border-transparent dark:text-white mt-2'>
                            {problem.examples[activeTestCaseId].inputText}
                        </div>
                        <p className='text-sm font-medium mt-4 dark:text-white'>Output:</p>
                        <div className='w-full cursor-text rounded-lg border px-3 py-[10px] dark:bg-dark-fill-3 bg-gray-200 border-transparent dark:text-white mt-2'>
                            {problem.examples[activeTestCaseId].outputText}
                        </div>
                    </div>
                </div>
            </Split>
            <EditorFooter handleSubmit={handleSubmit} />
        </div>

    );
}
