/**
 * Функция для склонения русских слов
 * Пример использования: declination(5, 'комментари|й|я|ев')
 *
 * @param      {number}  number  Число, для которого будет рассчитано окончание
 * @param      {string}  words   Слово и варианты окончаний для 1|2|1 (1 комментарий, 2 комментария, 100 комментариев)
 * @return     {string}  Слово с правильным окончанием
 */
const declination = (number: number, words: string): string => {
  const w = words.split("|");
  const n = Math.abs(number * 1);

  return n % 10 == 1 && n % 100 != 11
    ? w[0] + w[1]
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
    ? w[0] + w[2]
    : w[0] + w[3];
};

export default declination;
