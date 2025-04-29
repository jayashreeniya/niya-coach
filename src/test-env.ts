console.log('OpenAI API Key exists:', !!process.env.REACT_APP_OPENAI_API_KEY);
console.log('OpenAI API Key prefix:', process.env.REACT_APP_OPENAI_API_KEY?.substring(0, 7));

// Add empty export to make this a module
export {}; 