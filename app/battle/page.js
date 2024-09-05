'use client'
import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { twoSum } from '@/app/utils/problems/two-sum';
import Image from 'next/image';
import Playground from '@/app/components/Playground';
import HealthBar from '@/app/components/HealthBar';
import { useUser } from '@clerk/nextjs'

import { useAuth } from '@clerk/nextjs'; // Clerk authentication hook
import { db } from '../firebase/firebaseConfig'; // Firebase Firestore configuration
import { collection, addDoc } from "firebase/firestore"; 
import { fetchRandomProblem } from '../utils/problems'; // Utility function to fetch problems

export default function Battle() {
    const { isLoaded, isSignedIn, user } = useUser()

    const [playerHealth, setPlayerHealth] = useState(63);
    const [opponentHealth, setOpponentHealth] = useState(50);
    const [problem, setProblem] = useState(twoSum);

    // useEffect(() => {
    //     const getProblem = async () => {
    //         const problemData = await fetchRandomProblem();
    //         setProblem(problemData);
    //     };
    //     getProblem();
    // }, []);

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
            <Playground problem={problem} user={user} setOpponentHealth={setOpponentHealth} setPlayerHealth={setPlayerHealth} playerHealth={playerHealth} opponentHealth={opponentHealth} />    

        </Split>

    );
}