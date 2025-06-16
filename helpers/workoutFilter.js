const buildWorkoutFilterQuery = (baseQuery, filters, startIndex = 1) => {
  const { name, description } = filters;

  const values = [];
  let i = startIndex;

  if (name) {
    baseQuery += ` AND LOWER(name) LIKE $${i}`;
    values.push(`%${name.toLowerCase()}%`);
    i++;
  }

  if (description) {
    baseQuery += ` AND LOWER(description) LIKE $${i}`;
    values.push(`%${description.toLowerCase()}%`);
    i++;
  }

  return { query: baseQuery, values: values };
};

module.exports = {
  buildWorkoutFilterQuery,
};
