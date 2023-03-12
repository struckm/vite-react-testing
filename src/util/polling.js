const poll = ({ fn, validate, delay = 1000, maxAttempts = 5 }) => {
    console.log('Start poll...');
    let attempts = 0;
  
    const executePoll = async (resolve, reject) => {
      console.log('- poll');
      const result = await fn();
      attempts++;
  
      if (!!result) {
        return resolve(result);
      } else if (maxAttempts === attempts) {
        return reject(new Error('max attempts before a response'));
      } else {
        setTimeout(executePoll, delay, resolve, reject);
      }
    };
  
    return new Promise(executePoll);
  };
  
  const simulateServerRequestTime = interval => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  };
  
  const TIME_TO_CREATE_NEW_USER = 5000;
  
  let fakeUser = null;
  const createUser = (() => {
    setTimeout(() => {
      fakeUser = {
        id: '123',
        username: 'testuser',
        name: 'Test User',
        createdAt: Date.now(),
      };
    }, TIME_TO_CREATE_NEW_USER);
  })();
  
  const mockApi = async () => {
    await simulateServerRequestTime(500);
    return fakeUser;
  };
  
const validateUser = user => !!user;

const POLL_INTERVAL = 2000;

export const user = (async () => await poll({
    fn: mockApi,
    validate: validateUser
}))();

console.log(user);

    // .then(user => console.log(user))
    // .catch(err => console.error(err));