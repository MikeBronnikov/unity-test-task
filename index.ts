import { CountryCounts, FilteredStudents, ResultWithExtractedLl } from './src/types/index';
import mongoose from 'mongoose';
import { First } from './src/db/FirstSchema';
import { Second } from './src/db/SecondSchema';
import { Third } from './src/db/ThirdSchema';
import { firstCollectionInitialData } from './src/initialData/first';
import { secondCollectionInitialData } from './src/initialData/second';

const init = async () => {
  // 1
  await mongoose.connect('mongodb://localhost:27017/gologin');
  // 2
  await First.insertMany(firstCollectionInitialData);
  await Second.insertMany(secondCollectionInitialData);
  // 3
  const resultWithExtractedLl: ResultWithExtractedLl[] = await First.aggregate([
    {
      $addFields: {
        longitude: {
          $arrayElemAt: ['$location.ll', 0],
        },
        latitude: {
          $arrayElemAt: ['$location.ll', 1],
        },
      },
    },
  ]);
  // 4
  const resultWithDiffs = await First.aggregate([
    {
      $lookup: {
        from: 'seconds',
        as: 'countryStudentsStatistic',
        localField: 'country',
        foreignField: 'country',
      },
    },
    { $unwind: '$countryStudentsStatistic' },
    {
      $addFields: {
        overallStudents: '$countryStudentsStatistic.overallStudents',
        forCount: { $first: '$students' },
      },
    },
    {
      $addFields: {
        diff: { $subtract: ['$overallStudents', '$forCount.number'] },
      },
    },
    { $unset: ['overallStudents', 'forCount'] },
  ]);
  // 5
  const countryCounts: CountryCounts[] = await First.aggregate([
    { $group: { _id: '$country', count: { $sum: 1 } } },
  ]);

  // 6
  let secondResult: any[] = await Second.find({}, { country: 1, _id: 0 });
  let countries = secondResult.map((i: {country: string}) => i.country)
  const resulted = countries.map((country) => {
    const allDiffs = resultWithDiffs.reduce((filtered: any, option: any) => {
      if (option.country === country) {
        filtered.push(option.diff);
      }
      return filtered;
    }, []);
    const filteredStudents:FilteredStudents[] = resultWithExtractedLl.filter(
      (i) => i.country === country,
    );
    const longitude = filteredStudents.map((i) => i.longitude);
    const latitude = filteredStudents.map((i) => i.latitude);
    return {
      _id: country,
      allDiffs,
      count: countryCounts.find((i) => i._id === country)?.count,
      longitude,
      latitude,
    };
  });
  await Third.insertMany(resulted);
  console.log('completed successfully');
};

init();
