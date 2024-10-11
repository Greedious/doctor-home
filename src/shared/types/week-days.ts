const days = [
  {
    en: 'Sunday',
    ar: 'الأحد',
  },
  {
    en: 'Monday',
    ar: 'الاثنين',
  },
  {
    en: 'Tuesday',
    ar: 'الثلاثاء',
  },
  {
    en: 'Wednesday',
    ar: 'الأربعاء',
  },
  {
    en: 'Thursday',
    ar: 'الخميس',
  },
  {
    en: 'Friday',
    ar: 'الجمعة',
  },
  {
    en: 'Saturday',
    ar: 'السبت',
  },
];

export const getWeekDayName = (index: number, languageKey: string = 'ar') => {
  return days[index][languageKey];
};
