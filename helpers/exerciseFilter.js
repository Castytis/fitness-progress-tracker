const buildExerciseFilterQuery = (baseQuery, filters, startIndex = 1) => {
  const { name, category, muscle_group, difficulty } = filters;

  const values = [];
  let i = startIndex;

  if (name) {
    baseQuery += ` AND LOWER(name) LIKE $${i}`;
    values.push(`%${name}%`);
    i++;
  }

  if (category) {
    baseQuery += ` AND category = $${i}`;
    values.push(category);
    i++;
  }

  if (muscle_group) {
    baseQuery += ` AND muscle_group = $${i}`;
    values.push(muscle_group);
    i++;
  }

  if (difficulty) {
    baseQuery += ` AND difficulty = $${i}`;
    values.push(difficulty);
    i++;
  }

  return { query: baseQuery, values };
};

module.exports = {
  buildExerciseFilterQuery,
};
