const  User  = require('.././models/User');
// YtUser.save
const testUser = new User({email: 'hurr', expiresAt: 123});
testUser.save()
  .then(saved => {
    console.log('successfully saved:', saved);
  })
  .catch(error => {
    console.log(error)
  });

