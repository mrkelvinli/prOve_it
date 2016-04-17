import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  fs = Npm.require('fs');
  
  
  // #Storing Data -> Adding post examples
//  if(Posts.find().count() === 0) {
//
//    console.log('Adding dummy posts');
//    var dummyPosts = [
//      {
//        title: 'My First entry',
//        slug: 'my-first-entry',
//        description: 'Lorem ipsum dolor sit amet.',
//        text: 'Lorem ipsum dolor sit amet...',
//        timeCreated: moment().subtract(7,'days').unix(),
//        author: 'John Doe'
//      },
//      {
//        title: 'My Second entry',
//        slug: 'my-second-entry',
//        description: 'Borem ipsum dolor sit.',
//        text: 'Lorem ipsum dolor sit amet...',
//        timeCreated: moment().subtract(5,'days').unix(),
//        author: 'John Doe'
//      },
//      {
//        title: 'My Third entry',
//        slug: 'my-third-entry',
//        description: 'Dorem ipsum dolor sit amet.',
//        text: 'Lorem ipsum dolor sit amet...',
//        timeCreated: moment().subtract(3,'days').unix(),
//        author: 'John Doe'
//      },
//      {
//        title: 'My Fourth entry',
//        slug: 'my-fourth-entry',
//        description: 'Sorem ipsum dolor sit amet.',
//        text: 'Lorem ipsum dolor sit amet...',
//        timeCreated: moment().subtract(2,'days').unix(),
//        author: 'John Doe'
//      },
//      {
//        title: 'My Fifth entry',
//        slug: 'my-fifth-entry',
//        description: 'Korem ipsum dolor sit amet.',
//        text: 'Lorem ipsum dolor sit amet...',
//        timeCreated: moment().subtract(1,'days').unix(),
//        author: 'John Doe'
//      }
//    ];
//    // we add the dummyPosts to our database
//    _.each(dummyPosts, function(post){
//      Posts.insert(post);
//    });
//  }
  
  
});
