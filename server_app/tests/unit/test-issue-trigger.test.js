/**
 * Test file to trigger GitHub Issue creation
 * This test is intentionally failing to test the CI/CD issue creation feature
 * 
 * TO REMOVE: After testing, delete this file to restore normal test behavior
 */

describe('GitHub Issue Trigger Test', () => {
  describe('Intentional Test Failure', () => {
    it('should fail to trigger GitHub issue creation', () => {
      // This test will intentionally fail
      const expected = true;
      const actual = false;
      
      expect(actual).toBe(expected); // This will fail
    });

    it('should also fail with error message', () => {
      throw new Error('Test error to trigger GitHub issue - This is intentional for testing!');
    });

    it('should fail assertion', () => {
      expect(1 + 1).toBe(3); // Obviously wrong
    });
  });
});
