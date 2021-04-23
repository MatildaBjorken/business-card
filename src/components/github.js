
import React, { useState, useEffect } from 'react';

class Language {
  constructor(language, bytes, color) {
    this.language = language;
    this.bytes = bytes;
    this.color = color;
  }
}

class LanguageData {
  constructor(language, percent, color) {
    this.id = language;
    this.label = language;
    this.value = percent;
    this.color = color;
  }
}

const fetchRepos = async () => {
  const repoResp = await fetch(
    'https://api.github.com/users/matildabjorken/repos',
  ).then((res) => res.json());
  return repoResp;
};

const fetchLanguages = async (repos) => {
  try {
    let languagesInBytes = [];
    let colors = [
      '#90ee90',
      '#add8e6',
      '#ffc0cb',
      '#ffc0cb',
      '#272E3D',
      '#3B7B80',
      '#90ee90',
    ];
    let hasLanguageBeenSaved = false;

    await Promise.all(
      repos.map(async (repo) => {
        const langResp = await fetch(repo.languages_url);
        const languageData = await langResp.json();
        const languageBytes = Object.values(languageData);
        const languageNames = Object.keys(languageData);

        if (languageNames.length > 0) {
          //If project contains languages
          languageNames.forEach((languageName, index) => {
            if (languagesInBytes.length === 0) {
              languagesInBytes.push(
                new Language(languageName, languageBytes[index], colors[index])
              );
            } else {
              languagesInBytes.forEach((language) => {
                if (
                  languageName === language.language &&
                  !hasLanguageBeenSaved
                ) {
                  language.bytes += languageBytes[index];
                  hasLanguageBeenSaved = true;
                }
              });
              if (!hasLanguageBeenSaved) {
                languagesInBytes.push(
                  new Language(
                    languageName,
                    languageBytes[index],
                    colors[index]
                  )
                );
              }
              hasLanguageBeenSaved = false;
            }
          });
        }
      })
    );
    return languagesInBytes;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};

const convertToPercent = (languagesInBytes) => {
  let languagesInPercent = languagesInBytes;
  let sum = 0;
  let percentage = 0;

  languagesInBytes.forEach((language) => {
    sum += language.bytes;
  });

  languagesInBytes.map((language, index) => {
    percentage = Math.round((language.bytes / sum) * 1000) / 10;
    return (languagesInPercent[index].bytes = percentage);
  });

  return languagesInPercent;
};

const checkForOther = (languagesInPercent) => {
  let sumOfOther = 0;

  let sumFunction = (total, currentLanguage) => {
    return total + currentLanguage.bytes;
  };

  sumOfOther =
    Math.round(
      languagesInPercent
        .filter((language) => language.bytes < 1)
        .reduce(sumFunction, 0) * 10
    ) / 10;
  let languages = languagesInPercent.filter((language) => language.bytes > 1);

  if (sumOfOther > 0) {
    languages.splice();
    languages.push(new Language('Other', sumOfOther, '#CCCCCC'));
  }
  return languages;
};

const deconstructArray = (languagesWithOther) => {
  let languageData = [];

  languagesWithOther.forEach((language) => {
    languageData.push(
      new LanguageData(language.language, language.bytes, language.color)
    );
  });

  return languageData;
};

const getLanguages = async () => {
  const repos = await fetchRepos();
  const languagesInBytes = await fetchLanguages(repos);
  const languagesInPercent = convertToPercent(languagesInBytes);
  const languagesWithOther = checkForOther(languagesInPercent);
  const languages = deconstructArray(languagesWithOther);
  return languages;
};

export default getLanguages;
