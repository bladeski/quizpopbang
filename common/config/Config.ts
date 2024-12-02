type AppConfig = {
  JSON_PATH: string;
  JSON_FILES: {
    HOST: string;
    QUESTIONS: string;
    QUIZ: string;
    ROUNDS: string;
    TEAMS: string;
  };
};

const CONFIG: AppConfig = {
  JSON_PATH: 'src/data/json/',
  JSON_FILES: {
    HOST: 'host.json',
    QUESTIONS: 'questions.json',
    QUIZ: 'quiz.json',
    ROUNDS: 'rounds.json',
    TEAMS: 'teams.json',
  },
};

export default CONFIG;

export function getJsonPath(fileName: keyof AppConfig["JSON_FILES"]): string {
  return `${CONFIG.JSON_PATH}${CONFIG.JSON_FILES[fileName]}`; 
}