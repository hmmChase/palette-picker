exports.seed = function(knex, Promise) {
  return knex('palettes')
    .del() // delete all footnotes first
    .then(() => knex('projects').del()) // delete all papers
    .then(() => {
      return Promise.all([
        knex('projects')
          .insert(
            {
              project_name: 'Fooo'
            },
            'id'
          )
          .then(project => {
            return knex('palettes').insert([
              {
                palette_name: 'Fooo',
                color1: '#123456',
                color2: '#123456',
                color3: '#123456',
                color4: '#123456',
                color5: '#123456',
                color1: '#123456',
                project_id: project[0]
              },
              {
                palette_name: 'hola',
                color1: '#123456',
                color2: '#123456',
                color3: '#123456',
                color4: '#123456',
                color5: '#123456',
                color1: '#123456',
                project_id: project[0]
              }
            ]);
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
