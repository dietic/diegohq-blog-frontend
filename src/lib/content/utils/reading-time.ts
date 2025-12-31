import readingTimeLib from 'reading-time';

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

export const calculateReadingTime = (content: string): ReadingTimeResult => {
  const result = readingTimeLib(content);

  return {
    minutes: Math.ceil(result.minutes),
    words: result.words,
    text: result.text,
  };
};

export const getReadingTimeMinutes = (content: string): number => {
  return calculateReadingTime(content).minutes;
};
