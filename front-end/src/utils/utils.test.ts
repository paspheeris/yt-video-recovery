import {parseAuthHash} from './auth';
test(`parseHash correctly parses a hash url and returns an object with correct
      information`, () => {
    const testHash = "#state=pass-through+value&access_token=ya29.Glz8BFKiuPw7-Sbk7BqfWd5o5UBEjrVCF5eWtC87cdHqefBI1Y1goVVUwzI6W4_oRxhAiRQ0HcXhcrNwbO39kzDcPl6x9N3oEZD4Swrqr3JMxBrrx5poLddsfkT9PQ&token_type=Bearer&expires_in=3600&scope=https://www.googleapis.com/auth/youtube+https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile";
    expect(parseAuthHash(testHash)).toEqual({
        rawHash: testHash,
        state: "pass-through+value",
        access_token: "ya29.Glz8BFKiuPw7-Sbk7BqfWd5o5UBEjrVCF5eWtC87cdHqefBI1Y1goVVUwzI6W4_oRxhAiRQ0HcXhcrNwbO39kzDcPl6x9N3oEZD4Swrqr3JMxBrrx5poLddsfkT9PQ",
        token_type: "Bearer",
        expires_in: 3600,
        scope: "https://www.googleapis.com/auth/youtube+https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile"
    });
    });
