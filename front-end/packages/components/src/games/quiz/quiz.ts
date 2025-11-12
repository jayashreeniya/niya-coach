const questionCount: number = 10;

type QuizColor = "Red" | "Blue" | "Green" | "Yellow" | "Violet" | "Pink" | "Black" | "Brown" | "Orange" | "Grey";

const quizColors: QuizColor[] = ["Red", "Blue", "Green", "Yellow", "Violet", "Pink", "Black", "Brown", "Orange", "Grey"];

const colorCodes: string[] = ["#DC143C", "#6A5ACD", "#2E8B57", "#FFD700", "#9400D3", "#FF00FF", "#000000", "#8B4513", "#FFA500", "#A9A9A9"];


function generateQuestions(): Partial<Record<QuizColor, string> >{
  const result: Partial<Record<QuizColor, string>> = {};

  let remainingColors: QuizColor[] = [...quizColors];

  for(let i = 0; i < questionCount; i++){
    const colorIdx = Math.floor(Math.random() * ((remainingColors.length - 1) - 0 + 0) + 0);
    const color = remainingColors[colorIdx];
    remainingColors = remainingColors.filter(c => c !== color);

    const randIdx: number = Math.floor(Math.random() * (9 - 0 + 0) + 0);
    const code = colorCodes[randIdx];
    result[color] = code
  }

  return result;
}

function shuffle(arr: any[]): any[] {
  return arr.map(x => ({ x, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.x);
}

function generateOptions(color: QuizColor, code: string): { name: QuizColor, code: string }[] {
  const options: { name: QuizColor, code: string }[] = [];
  let remainingOptions = quizColors.filter(c => c !== color);

  remainingOptions = remainingOptions.filter(c => c !== color);
  const codeIndex = quizColors.indexOf(color);
  const actualCode = colorCodes[codeIndex];
  const remainingCodes = colorCodes.filter(c => c !== actualCode);
  const optIndex: number[]=[];
  const selectedCodes: number[]=[];
  for(let i = 0; i < 4; i++){
    let colorIdx = Math.floor(Math.random() * ((remainingOptions.length - 1) - 0 + 0) + 0);
    if(optIndex.indexOf(colorIdx) !== -1)
    {
      colorIdx = Math.floor(Math.random() * ((remainingOptions.length - 1) - 0 + 0) + 0);
    }
    else
    {
      optIndex.push(colorIdx);
    }
    const name = remainingOptions[colorIdx];
    remainingOptions = remainingOptions.filter(c => c !== name);

    let randIdx: number = Math.floor(Math.random() * (8 - 0 + 0) + 0);
    if(selectedCodes.indexOf(randIdx) !== -1)
    {
      randIdx = Math.floor(Math.random() * (8 - 0 + 0) + 0);
    }
    else{
      selectedCodes.push(randIdx);
    }
    const code = remainingCodes[randIdx];
    if(i===3)
    {
      options.push({ name, code: actualCode });
    }
    else{
    options.push({ name, code });
    }
  }
  
  return shuffle(options);
}

function verify(color: any, code: string){
  const colorIndex = quizColors.indexOf(color);
  const codeIndex = colorCodes.indexOf(code);
  return codeIndex === colorIndex;
}

export {
  questionCount,
  QuizColor,
  generateQuestions,
  generateOptions,
  verify
}