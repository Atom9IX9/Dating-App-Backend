export const users: TUser[] = [
  {
    id: 'aUsdknmdfnLfhsTTsfl',
    firstName: 'Mark',
    lastName: 'Zukerberg',
    age: 53,
    gender: 'male',
    location: 'Street 1, 23a, f 60',
    seekingParams: {
      age: {
        max: 60,
        min: 50,
      },
      gender: 'female',
    },
  },
  {
    id: 'vvmkdmfkdfmkkkdrrmc',
    firstName: 'Yaroslav',
    lastName: 'Vorobyov',
    age: 15,
    gender: 'male',
    location: 'Street 2, 1a, f 70',
    seekingParams: {
      age: {
        max: 16,
        min: 13,
      },
      gender: 'female',
    },
  },
  {
    id: 'odfmfkSkftaalKdkf',
    firstName: 'Viktoria',
    lastName: 'Myzykh',
    age: 23,
    gender: 'female',
    location: 'Street 3, 5a',
    seekingParams: {
      age: {
        max: 30,
        min: 18,
      },
      gender: 'female',
    },
  },
];

type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: TGender;
  location: string;
  seekingParams: {
    gender: TGender;
    age: TMinMax;
  };
};

type TGender = 'male' | 'female' | 'any';
type TMinMax = {
  min: number;
  max: number;
};
