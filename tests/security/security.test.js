/**
 * GradPath — Security Unit Tests
 * Tests encryption, sanitisation, and RBAC.
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-for-testing-only';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars!!';

const { encryption, sanitiser, rbac } = require('../../security');

describe('Encryption Service', () => {
  test('should encrypt and decrypt a string', () => {
    const original = 'Sensitive student data 12345';
    const encrypted = encryption.encrypt(original);

    expect(encrypted).not.toBe(original);
    expect(encrypted).toContain(':'); // iv:ciphertext format

    const decrypted = encryption.decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  test('should produce different ciphertexts for same input (random IV)', () => {
    const text = 'Same text';
    const enc1 = encryption.encrypt(text);
    const enc2 = encryption.encrypt(text);
    expect(enc1).not.toBe(enc2); // different IVs
  });

  test('should handle empty/null input gracefully', () => {
    expect(encryption.encrypt('')).toBe('');
    expect(encryption.encrypt(null)).toBeNull();
    expect(encryption.decrypt('')).toBe('');
    expect(encryption.decrypt(null)).toBeNull();
  });

  test('should produce consistent hashes', () => {
    const h1 = encryption.hash('test@uni.edu');
    const h2 = encryption.hash('test@uni.edu');
    expect(h1).toBe(h2);
    expect(h1.length).toBe(64); // SHA-256 hex
  });
});

describe('Sanitiser', () => {
  test('should strip HTML tags from strings', () => {
    const result = sanitiser.sanitiseString('<script>alert("xss")</script>Hello');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).toContain('Hello');
  });

  test('should strip javascript: protocol', () => {
    const result = sanitiser.sanitiseString('javascript:alert(1)');
    expect(result).not.toContain('javascript:');
  });

  test('should sanitise nested objects', () => {
    const input = {
      name: '<b>Test</b>',
      nested: { value: '<script>bad</script>' },
      arr: ['<img onerror=alert(1)>'],
    };
    const result = sanitiser.sanitiseObject(input);
    expect(result.name).not.toContain('<');
    expect(result.nested.value).not.toContain('<');
  });

  test('should validate email addresses', () => {
    expect(sanitiser.isValidEmail('user@example.com')).toBe(true);
    expect(sanitiser.isValidEmail('not-an-email')).toBe(false);
    expect(sanitiser.isValidEmail('')).toBe(false);
  });

  test('should validate MongoDB ObjectIds', () => {
    expect(sanitiser.isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    expect(sanitiser.isValidObjectId('invalid-id')).toBe(false);
    expect(sanitiser.isValidObjectId('123')).toBe(false);
  });
});

describe('RBAC Policy Engine', () => {
  test('admin should have all user management permissions', () => {
    expect(rbac.hasPermission('admin', 'user:create')).toBe(true);
    expect(rbac.hasPermission('admin', 'user:delete')).toBe(true);
    expect(rbac.hasPermission('admin', 'audit:read')).toBe(true);
  });

  test('student should only have own-data permissions', () => {
    expect(rbac.hasPermission('student', 'placement:read:own')).toBe(true);
    expect(rbac.hasPermission('student', 'placement:read:all')).toBe(false);
    expect(rbac.hasPermission('student', 'user:delete')).toBe(false);
  });

  test('academic_staff should have placement management permissions', () => {
    expect(rbac.hasPermission('academic_staff', 'placement:create')).toBe(true);
    expect(rbac.hasPermission('academic_staff', 'placement:approve')).toBe(true);
    expect(rbac.hasPermission('academic_staff', 'placement:delete')).toBe(false);
  });

  test('placement_supervisor should access assigned placements', () => {
    expect(rbac.hasPermission('placement_supervisor', 'placement:read:assigned')).toBe(true);
    expect(rbac.hasPermission('placement_supervisor', 'placement:read:all')).toBe(false);
  });

  test('hasAllPermissions should require all listed permissions', () => {
    expect(
      rbac.hasAllPermissions('admin', ['user:create', 'user:delete', 'audit:read'])
    ).toBe(true);
    expect(
      rbac.hasAllPermissions('student', ['placement:read:own', 'user:delete'])
    ).toBe(false);
  });

  test('hasAnyPermission should require at least one', () => {
    expect(
      rbac.hasAnyPermission('student', ['placement:read:own', 'user:delete'])
    ).toBe(true);
    expect(
      rbac.hasAnyPermission('student', ['user:delete', 'audit:read'])
    ).toBe(false);
  });

  test('unknown role should have no permissions', () => {
    expect(rbac.hasPermission('unknown', 'anything')).toBe(false);
    expect(rbac.getPermissions('unknown')).toEqual([]);
  });
});
