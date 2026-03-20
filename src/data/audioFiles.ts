import type { LennyAudio } from '../types';

const BASE = 'https://raw.githubusercontent.com/kabousvlieg/LennyBot/master';

function audio(file: string, label: string): LennyAudio {
  return { url: `${BASE}/${encodeURIComponent(file)}`, label };
}

export const LENNY_AUDIOS: LennyAudio[] = [
  audio('Sorry I can barely hear ya there .mp3', "Sorry, I can barely hear ya there..."),
  audio('Yes yes yes..mp3', "Yes, yes, yes!"),
  audio('Ah good yes yes yes..mp3', "Ah good, yes yes yes!"),
  audio('Someone did call last week about the same thing was that you.mp3', "Someone did call last week about the same thing — was that you?"),
  audio('Sorry what was you name again.mp3', "Sorry, what was your name again?"),
  audio('Its funny that you should call because my thirdeldest Larissa....mp3', "It's funny you should call, because my third-eldest Larissa..."),
  audio('Im sorry I couldnt quite catch ya there what was that again.mp3', "I'm sorry, I couldn't quite catch ya there — what was that again?"),
  audio('Sorry again.mp3', "Sorry again..."),
  audio('Could you say that again please.mp3', "Could you say that again please?"),
  audio('Sorry which company did you say you were calling from again.mp3', "Sorry, which company did you say you were calling from again?"),
  audio('Heres the thing cause the last time someone called up and spoke to me... .mp3', "Here's the thing, 'cause the last time someone called up and spoke to me..."),
  audio('Since you put it that way you have been quite friendly with me here... .mp3', "Since you put it that way, you have been quite friendly with me here..."),
  audio('Well with the world finances they way they are....mp3', "Well, with the world finances the way they are..."),
  audio('Well that does sound good you have been very patient with an old man here....mp3', "Well, that does sound good — you have been very patient with an old man here..."),
];
