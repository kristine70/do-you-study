// Ensure in-memory database is used for testing.
// process.env.SQLITE_FILE = ':memory:';

import guildMembers, {db} from '../src/services/member';
import {MembersDbSchema} from '../src/utils/database';

// The MembersDbSchema interface is used for type checking query results.
import {stringfyTime} from '../src/utils/date';

describe('MembersService', () => {
  describe('addOne', () => {
    it('should insert a new member record with correct user_id, user_name, and last_vc_time', () => {
      const user_id = 'test_user_1';
      const user_name = 'Test User 1';
      const now = new Date();

      guildMembers.addOne(user_id, user_name, now);

      const row = db
        .prepare('SELECT * FROM core_members WHERE user_id = ?')
        .get(user_id) as MembersDbSchema;

      expect(row).toBeDefined();
      expect(row?.user_id).toBe(user_id);
      // Assuming your DB schema includes a user_name column.
      expect(row?.user_name).toBe(user_name);

      // Validate that the stored last_vc_time matches using our string conversion.
      expect(row?.last_vc_time).toBe(stringfyTime(now));
    });
  });

  describe('updateLastVCTime', () => {
    it('should update the last_vc_time for an existing member', () => {
      const user_id = 'test_user_2';
      const user_name = 'Test User 2';
      const initialTime = new Date('2023-01-01T00:00:00Z');

      guildMembers.addOne(user_id, user_name, initialTime);

      let row = db
        .prepare('SELECT * FROM core_members WHERE user_id = ?')
        .get(user_id) as MembersDbSchema;
      expect(row?.last_vc_time).toBe(stringfyTime(initialTime));

      const updatedTime = new Date('2023-06-01T00:00:00Z');
      guildMembers.updateLastVCTime(user_id, updatedTime);

      row = db.prepare('SELECT * FROM core_members WHERE user_id = ?').get(user_id) as MembersDbSchema;
      expect(row?.last_vc_time).toBe(stringfyTime(updatedTime));
    });
  });

  describe('delete', () => {
    it('should delete the member record based on user_id', () => {
      const user_id = 'test_user_3';
      const user_name = 'Test User 3';
      const now = new Date();

      // Add a member then delete.
      guildMembers.addOne(user_id, user_name, now);

      let row = db.prepare('SELECT * FROM core_members WHERE user_id = ?').get(user_id);
      expect(row).toBeDefined();

      guildMembers.delete(user_id);

      // Verify that the record no longer exists.
      row = db.prepare('SELECT * FROM core_members WHERE user_id = ?').get(user_id);
      expect(row).toBeUndefined();
    });
  });

  describe('getLastVCTime', () => {
    it('should return the last_vc_time for an existing member', () => {
      const user_id = 'test_user_4';
      const user_name = 'Test User 4';
      const specificTime = new Date('2023-05-05T05:05:05Z');

      guildMembers.addOne(user_id, user_name, specificTime);
      const retrievedTime = guildMembers.getLastVCTime(user_id);

      expect(stringfyTime(retrievedTime)).toBe(stringfyTime(specificTime));
    });

    it('should return a new date if the member does not exist', () => {
      const user_id = 'non_existent_user';
      const beforeCall = new Date();
      const retrievedTime = guildMembers.getLastVCTime(user_id);
      const afterCall = new Date();

      // The returned date should be within a short time window of the current time.
      expect(retrievedTime.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(retrievedTime.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });
  });
});
