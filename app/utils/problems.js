// app/utils/problems.js

export const fetchRandomProblem = async () => {
    try {
        // Fetch all problems from the LeetCode API
        const response = await fetch('https://leetcode.com/api/problems/algorithms/');
        const data = await response.json();

        // Select a random problem from the list
        const problems = data.stat_status_pairs;
        const randomIndex = Math.floor(Math.random() * problems.length);
        const randomProblem = problems[randomIndex];

        // Get the problem details using the slug (unique identifier)
        const problemSlug = randomProblem.stat.question__title_slug;
        const problemDetailsResponse = await fetch(`https://leetcode.com/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query getQuestionDetail($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                            title
                            content
                            exampleTestcases
                            constraints
                        }
                    }
                `,
                variables: {
                    titleSlug: problemSlug,
                },
            }),
        });

        const problemDetails = await problemDetailsResponse.json();
        const problemData = problemDetails.data.question;

        return {
            title: problemData.title,
            problemStatement: problemData.content,
            examples: problemData.exampleTestcases.map((example, index) => ({
                id: index,
                inputText: example,
                outputText: 'Output not available',
                explanation: 'No explanation provided',
                img: null,
            })),
            constraints: problemData.constraints || 'No constraints provided',
        };
    } catch (error) {
        console.error('Error fetching problem:', error);
        return null;
    }
};
