export const credentials = {
  admin: {
    username: process.env.ADMIN_USERNAME || 'Admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  invalid: {
    username: 'wronguser',
    password: 'wrongpass',
  },
};

export const employeeData = {
  generate() {
    const ts = Date.now();
    return {
      firstName: `Auto${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      lastName: `Test${ts.toString().slice(-4)}`,
      employeeId: `EMP${ts.toString().slice(-6)}`,
    };
  },

  withLogin() {
    const ts = Date.now();
    return {
      ...this.generate(),
      username: `user_${ts.toString().slice(-6)}`,
      password: 'AutoTest@123',
    };
  },

  search: {
    validName: 'Paul',
    invalidName: 'ZZZZNONEXISTENT',
  },
};
