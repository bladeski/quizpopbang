import * as fs from 'node:fs/promises';

import { Host, Round, Team } from '../common/types/index.ts';
import { LinkerQuestion, MultipleChoiceQuestion, SimpleQuestion, TrueFalseQuestion } from '../common/types/Question.ts';

import { Quiz } from '../common/types/Quiz.ts';

// import { QuestionType, SimpleQuestion } from '../common/types';

enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SIMPLE = "simple",
  LINKER = "linker",
}

const quizData: Quiz = {
  name: 'Quizmas Time',
  host: 'Quizmaster',
  rounds: [],
  teams: [
    '1a8a10ae-d10f-4512-bc97-cadf5c2e1580',
    '71465370-2acf-40cb-9809-58a76202df2f',
    '95de81e4-ff57-4692-bf5d-969ba390150d',
    'ca816752-d620-473e-af76-45a1fe82b131',
    '1f65e55d-b363-441f-bfa2-0c8cbbaadd38',
    'f693d776-a739-4c09-b460-4fc6b71434dc',
    'f62a5cb2-5331-4a34-8eb8-9bdd04118f06',
    '355d2a16-0cf7-4f5a-a359-d3ca72c05b06',
    'd66a2476-11fa-468c-84b6-774d9e8a3759',
    '9e7439d7-134f-4bc8-a534-973431fc65f0',
    '821c3a8b-d0fa-45b5-a3e4-fd7ebb52b456',
    'afbe139d-8a20-4e65-9586-9ed94a51847b',
    '07af0c83-cbe7-424a-ac35-5cb1952a0296',
    'dee5272d-1ad9-470a-b54e-5cdd0830d781',
    'aff19339-2e94-4eba-b9c0-747ff0ca87d8',
    'b4341cc4-34f5-4d10-aff1-a155e7ca6feb',
    '6485c703-8d24-43db-aea0-f391c8a12338',
    'bf17477c-d0aa-4203-8930-d3d72437024e',
    '694487fd-1f2a-4a09-88c4-fe0b776bb722',
    '1c0ee9bf-ffae-4065-b133-27290af002c0'
  ],
  currentRound: 0,
  currentQuestion: 0,
  quizImageUrl: '',
};

const hostData: Host = {
  name: 'Quizmaster',
  password: 'password',
  token: '',
};  

const roundData: Round[] = [
  {
    id: 0,
    name: 'General Knowledge',
    questions: [0,1,2,3,4],
  }, {
    id: 1,
    name: 'Christmas',
    questions: [20,21,22,23,24,25,26],
  }, {
    id: 2,
    name: '2024',
    questions: [40,41],
  }, {
    id: 3,
    name: 'Disney',
    questions: [60,61,62,63,64,65,70],
  }, {
    id: 4,
    name: 'Movies & Music',
    questions: [80,81],
  }
];

const questionData: (SimpleQuestion | MultipleChoiceQuestion | TrueFalseQuestion | LinkerQuestion)[] = [
  // General Knowledge
  {
    id: 0,
    type: QuestionType.SIMPLE,
    question: 'What is the capital of France?',
    answer: 'Paris',
    points: 5,
    answerImageUrl: '',
    forKids: true,
  },
  {
    id: 1,
    type: QuestionType.MULTIPLE_CHOICE,
    question: 'Which of these is not a mammal?',
    answer: 'Salmon',
    options: ['Dog', 'Cat', 'Salmon', 'Elephant'],
    points: [10, 5, 2, 1],
    imageUrl: [],
    answerImageUrl: '',
    forKids: true,
  },
  {
    id: 2,
    type: QuestionType.TRUE_FALSE,
    question: 'There are more stars in the universe than grains of sand on Earth.',
    answer: true,
    points: 5,
    imageUrl: [],
    answerImageUrl: '',
    answerInfo: 'Scientists estimate there are around 10,000 stars for every grain of sand on Earth.',
  },
  {
    id: 3,
    type: QuestionType.SIMPLE,
    question: 'What is the name of this famous landmark?',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Great_Wall_of_China_July_2009.jpg',
    answer: 'Great Wall of China',
    forKids: true,
    points: 5,
    answerImageUrl: '',
  },
  {
    id: 4,
    type: QuestionType.MULTIPLE_CHOICE,
    question: 'Which of these days is not named after a Norse God?',
    answer: 'Tuesday',
    options: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    points: [10, 5, 2, 1],
    imageUrl: [],
    answerImageUrl: '',
  },
  // As a team, draw a picture of what Christmas means to you... 5 mins
  // Christmas
  {
    id: 20,
    type: QuestionType.MULTIPLE_CHOICE,
    question: 'Which of these is not a traditional Christmas colour?',
    answer: 'Purple',
    options: ['Red', 'Green', 'Purple', 'Gold'],
    points: [10, 5, 2, 1],
    imageUrl: [],
    answerImageUrl: '',
    forKids: true,
  },
  {
    id: 21,
    type: QuestionType.SIMPLE,
    question: 'In which country was the Christmas cracker invented?',
    answer: 'London',
    points: 5,
    answerImageUrl: '',
    answerInfo: 'Tom Smith, a London sweet shop owner, invented the Christmas cracker in 1847.',
  },
  {
    id: 22,
    type: QuestionType.MULTIPLE_CHOICE,
    question: 'What is Santa\'s real name?',
    answer: 'Saint Nicholas',
    options: ['Saint Nicholas', 'Saint Stephen', 'Jimmy', 'Saint John'],
    points: [10, 5, 2, 1],
    imageUrl: [],
    answerImageUrl: '',
    forKids: true,
  },
  {
    id: 23,
    type: QuestionType.SIMPLE,
    question: 'What colour are mistletoe berries?',
    answer: 'White',
    points: 5,
    answerImageUrl: '',
    forKids: true,
  },
  {
    id: 24,
    type: QuestionType.SIMPLE,
    question: 'Good King Wenceslas looked out on the feast of Stephen, but when is the feast of Stephen?',
    answer: '26th December/Boxing Day',
    points: 5,
    answerImageUrl: '',
  },
  {
    id: 25,
    type: QuestionType.SIMPLE,
    question: 'What made Frosty the Snowman come to life?',
    answer: 'An old silk hat',
    points: 5,
    answerImageUrl: '',
  },
  {
    id: 26,
    type: QuestionType.LINKER,
    question: 'What links the 4 answers?',
    questions: [
      {
        id: 27,
        type: QuestionType.SIMPLE,
        question: 'If you looked at the sky at night and saw Polaris, what would you be looking at?',
        answer: 'Star',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 28,
        type: QuestionType.SIMPLE,
        question: 'What is the name of Shrek\'s best friend?',
        answer: 'Donkey',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 29,
        type: QuestionType.SIMPLE,
        question: 'What character often tops the Christmas tree?',
        answer: 'Angel',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 30,
        type: QuestionType.SIMPLE,
        question: 'What is the first name of the baker Mrs Berry?',
        answer: 'Mary',
        points: 0,
        answerImageUrl: '',
      }
    ],
    answer: 'Baby Jesus/Nativity/First Christmas',
    points: [20, 15, 10, 5, 2, 1],
    answerImageUrl: '',
    forKids: true,
  },
  // Adult nominated from each team to do their best dad dance to a Christmas song
  // 2024
  {
    id: 40,
    type: QuestionType.SIMPLE,
    question: 'Which 2024 movie featured characters such as Bob, Edith and Gru?',
    answer: 'Despicable Me 4',
    points: 5,
    answerImageUrl: '',
    forKids: true,
  },
  {
    id: 41,
    type: QuestionType.LINKER,
    question: 'What links the 4 answers?',
    questions: [
      {
        id: 42,
        type: QuestionType.SIMPLE,
        question: 'What is the name of the southern half of the Scottish island upon which there were recent protests about a supermarket opening on a Sunday?',
        answer: 'Harris',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 43,
        type: QuestionType.SIMPLE,
        question: 'Greggs have recently launched a limited edition of which popular card game?',
        answer: 'Top Trumps',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 44,
        type: QuestionType.SIMPLE,
        question: 'International Workers Day, celebrated on May 1st, is also known as what?',
        answer: 'Labour Day',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 45,
        type: QuestionType.SIMPLE,
        question: 'What is the name of the singer that voiced "Meena" in the Sing movies? ____ Kelly',
        answer: 'Tori',
        points: 0,
        answerImageUrl: '',
      }
    ],
    answer: 'Elections/Election Year',
    points: [20, 15, 10, 5, 2, 1],
    answerImageUrl: '',
  },
  // Adult do their best impression of a Disney character
  // Disney
  {
    id: 60,
    type: QuestionType.MULTIPLE_CHOICE,
    question: 'Which Disney princess came first?',
    answer: 'Snow White',
    options: ['Snow White', 'Belle', 'Jasmine', 'Ariel'],
    points: [10, 5, 2, 1],
    forKids: true,
    imageUrl: [],
    answerImageUrl: ''
  },
  {
    id: 61,
    type: QuestionType.MULTIPLE_CHOICE,
    question: 'Which of these is not in the Disney princess franchise?',
    answer: 'Anna',
    options: ['Ariel', 'Anna', 'Mulan', 'Pocahontas'],
    points: [10, 5, 2, 1],
    imageUrl: [],
    answerImageUrl: '',
    answerInfo: 'The franchise includes Snow White, Cinderella, Aurora, Ariel, Belle, Jasmine, Pocahontas, Mulan, Tiana, Rapunzel, Merida, Moana, and Raya. Anna belongs to the Frozen franchise.',
  },
  {
    id: 62,
    type: QuestionType.SIMPLE,
    question: 'Who is this?',
    imageUrl: '',
    answer: 'Spiderman/Spidey',
    points: 5,
    forKids: true,
    answerImageUrl: '',
  },
  {
    id: 63,
    type: QuestionType.SIMPLE,
    question: 'In which decade did Disneyland open?',
    answer: '1950s',
    points: 5,
    answerImageUrl: '',
  },
  {
    id: 64,
    type: QuestionType.SIMPLE,
    question: 'Who is the only title character of a Disney film that doesn\'t speak?',
    answer: 'Dumbo',
    points: 5,
    answerImageUrl: '',
  },
  {
    id: 65,
    type: QuestionType.LINKER,
    question: 'What links the 4 answers?',
    forKids: true,
    questions: [
      {
        id: 66,
        type: QuestionType.SIMPLE,
        question: 'What sport involves bowling, batting, fielding and has wickets?',
        answer: 'Cricket',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 67,
        type: QuestionType.SIMPLE,
        question: 'In Minecraft, what kind of creature is the boss found in The End?',
        answer: 'Dragon/Ender Dragon',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 68,
        type: QuestionType.SIMPLE,
        question: 'What is the largest country in Asia?',
        answer: 'China',
        points: 0,
        answerImageUrl: '',
      },
      {
        id: 69,
        type: QuestionType.SIMPLE,
        question: 'What is the title of the daughter of a king?',
        answer: 'Princess',
        points: 0,
        answerImageUrl: '',
      }
    ],
    answer: 'Mulan',
    points: [20, 15, 10, 5, 2, 1],
    answerImageUrl: '',
  },
  {
    id: 70,
    type: QuestionType.SIMPLE,
    question: 'Who voiced the Genie in animated movie Aladdin?',
    answer: 'Robin Williams',
    points: 5,
    imageUrl: '',
    answerImageUrl: '',
  },
  // Adult & kid to come out and reenact famous movie scenes
  // Movies & Music
  {
    id: 80,
    type: QuestionType.TRUE_FALSE,
    question: 'The song "I Will Always Love You" was originally sung by Dolly Parton.',
    answer: false,
    points: 10,
    answerImageUrl: '',
  },
  {
    id: 81,
    type: QuestionType.SIMPLE,
    question: 'Rebus: What song is this?',
    imageUrl: 'public/images/rebus-1.svg',
    answer: 'Feliz Navidad',
    points: 5,
    answerImageUrl: '',
  }
];

const teamData: Team[] = [
  {
    id: '1a8a10ae-d10f-4512-bc97-cadf5c2e1580',
    name: 'The Jingle Belters',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '71465370-2acf-40cb-9809-58a76202df2f',
    name: 'The Red-Nosed Braindeer',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '95de81e4-ff57-4692-bf5d-969ba390150d',
    name: 'The Silent Knights',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'ca816752-d620-473e-af76-45a1fe82b131',
    name: 'A Wean In A Manger',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '1f65e55d-b363-441f-bfa2-0c8cbbaadd38',
    name: 'The Quizmas Carols',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'f693d776-a739-4c09-b460-4fc6b71434dc',
    name: 'The Mince Spies',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'f62a5cb2-5331-4a34-8eb8-9bdd04118f06',
    name: 'The Bleak Mid-Winners',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '355d2a16-0cf7-4f5a-a359-d3ca72c05b06',
    name: 'Almost on the Good List',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'd66a2476-11fa-468c-84b6-774d9e8a3759',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '9e7439d7-134f-4bc8-a534-973431fc65f0',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '821c3a8b-d0fa-45b5-a3e4-fd7ebb52b456',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'afbe139d-8a20-4e65-9586-9ed94a51847b',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '07af0c83-cbe7-424a-ac35-5cb1952a0296',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'dee5272d-1ad9-470a-b54e-5cdd0830d781',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'aff19339-2e94-4eba-b9c0-747ff0ca87d8',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'b4341cc4-34f5-4d10-aff1-a155e7ca6feb',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '6485c703-8d24-43db-aea0-f391c8a12338',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: 'bf17477c-d0aa-4203-8930-d3d72437024e',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '694487fd-1f2a-4a09-88c4-fe0b776bb722',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
  {
    id: '1c0ee9bf-ffae-4065-b133-27290af002c0',
    name: '',
    players: [],
    answers: [],
    totalPoints: 0,
  },
];

await fs.mkdir('json', { recursive: true });

await Promise.all([
  fs.writeFile('json/quiz.json', JSON.stringify(quizData)),
  fs.writeFile('json/host.json', JSON.stringify(hostData)),
  fs.writeFile('json/rounds.json', JSON.stringify(roundData)),
  fs.writeFile('json/questions.json', JSON.stringify(questionData)),
  fs.writeFile('json/teams.json', JSON.stringify(teamData))
]).then(() => console.log('Seed data written to file'))
  .catch((err) => console.error(err));
  
// Team GUIDs
// 1a8a10ae-d10f-4512-bc97-cadf5c2e1580
// 71465370-2acf-40cb-9809-58a76202df2f
// 95de81e4-ff57-4692-bf5d-969ba390150d
// ca816752-d620-473e-af76-45a1fe82b131
// 1f65e55d-b363-441f-bfa2-0c8cbbaadd38
// f693d776-a739-4c09-b460-4fc6b71434dc
// f62a5cb2-5331-4a34-8eb8-9bdd04118f06
// 355d2a16-0cf7-4f5a-a359-d3ca72c05b06
// d66a2476-11fa-468c-84b6-774d9e8a3759
// 9e7439d7-134f-4bc8-a534-973431fc65f0
// 821c3a8b-d0fa-45b5-a3e4-fd7ebb52b456
// afbe139d-8a20-4e65-9586-9ed94a51847b
// 07af0c83-cbe7-424a-ac35-5cb1952a0296
// dee5272d-1ad9-470a-b54e-5cdd0830d781
// aff19339-2e94-4eba-b9c0-747ff0ca87d8
// b4341cc4-34f5-4d10-aff1-a155e7ca6feb
// 6485c703-8d24-43db-aea0-f391c8a12338
// bf17477c-d0aa-4203-8930-d3d72437024e
// 694487fd-1f2a-4a09-88c4-fe0b776bb722
// 1c0ee9bf-ffae-4065-b133-27290af002c0