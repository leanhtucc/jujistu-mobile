const store = new Map();

const mockKeychain = {
  SECURITY_LEVEL: {
    ANY: 'ANY',
    SECURE_SOFTWARE: 'SECURE_SOFTWARE',
    SECURE_HARDWARE: 'SECURE_HARDWARE',
  },
  ACCESSIBLE: {
    WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
    AFTER_FIRST_UNLOCK: 'AccessibleAfterFirstUnlock',
    ALWAYS: 'AccessibleAlways',
    WHEN_PASSCODE_SET_THIS_DEVICE_ONLY:
      'AccessibleWhenPasscodeSetThisDeviceOnly',
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY:
      'AccessibleAfterFirstUnlockThisDeviceOnly',
    ALWAYS_THIS_DEVICE_ONLY: 'AccessibleAlwaysThisDeviceOnly',
  },
  ACCESS_CONTROL: {
    USER_PRESENCE: 'UserPresence',
    BIOMETRY_ANY: 'BiometryAny',
    BIOMETRY_CURRENT_SET: 'BiometryCurrentSet',
    DEVICE_PASSCODE: 'DevicePasscode',
    APPLICATION_PASSWORD: 'ApplicationPassword',
    BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BiometryAnyOrDevicePasscode',
    BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE:
      'BiometryCurrentSetOrDevicePasscode',
  },
  AUTHENTICATION_TYPE: {
    DEVICE_PASSCODE_OR_BIOMETRICS:
      'AuthenticationTypeDevicePasscodeOrBiometrics',
    BIOMETRICS: 'AuthenticationTypeBiometrics',
  },

  setGenericPassword: jest.fn(async (username, password, options = {}) => {
    const service = options.service || 'default';
    store.set(service, { username, password, service });
    return { service, storage: 'mock' };
  }),

  getGenericPassword: jest.fn(async (options = {}) => {
    const service = options.service || 'default';
    const entry = store.get(service);
    return entry || false;
  }),

  resetGenericPassword: jest.fn(async (options = {}) => {
    const service = options.service || 'default';
    store.delete(service);
    return true;
  }),

  hasInternetCredentials: jest.fn(async () => false),
  setInternetCredentials: jest.fn(async () => true),
  getInternetCredentials: jest.fn(async () => false),
  resetInternetCredentials: jest.fn(async () => true),

  __resetMockStorage: () => {
    store.clear();
  },
};

module.exports = mockKeychain;
