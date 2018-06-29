exports.seed = function(knex, Promise) {
  return knex('palettes')
    .del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects')
          .insert(
            {
              project_name: 'Seed project'
            },
            'id'
          )
          .then(project => {
            return knex('palettes').insert([
              {
                palette_name: 'Seed palette 1',
                color1: '#874D94',
                color2: '#013A9B',
                color3: '#BE52F9',
                color4: '#4B69ED',
                color5: '#87E9CD',
                project_id: project[0]
              },
              {
                palette_name: 'Seed palette 2',
                color1: '#D2DC61',
                color2: '#AF0959',
                color3: '#8ACFD2',
                color4: '#F5A9B0',
                color5: '#9367D7',
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
