import Memberservice from '../src/services/member';

test('general', () => {
  Memberservice.upsert(`1046833163042816151`, `test_user_1`, new Date('2025-04-10 10:20:12'));
  Memberservice.upsert(`1267378543805862026`, `test_user_2`, new Date('2025-04-10 10:20:12'));
  for (let i = 0; i < 4; i++) {
    Memberservice.delete(`1231231231231-${i}`);
  }
});
