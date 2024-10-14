import { login } from "../src/js/api/auth/login.js";
import { logout } from "../src/js/api/auth/logout.js";

describe("login", () => {
  const email = "user@example.com";
  const password = "password123";
  const mockAccessToken = "mockUserToken";
  const mockProfile = {
    name: "John Doe",
    email: "john@example.com",
    accessToken: mockAccessToken,
  };

  // Mock a successful API response
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockProfile),
  });

  // Mock localStorage
  const mockStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  globalThis.localStorage = mockStorage;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("Successfully save the token", async () => {
    await login(email, password);

    const token = localStorage.getItem("token");
    const accessToken = JSON.parse(token);
    expect(accessToken).toEqual(mockAccessToken);
  });

  it("Deletes the token successfully", async () => {
    await login(email, password);
    logout();

    const token = localStorage.getItem("token");
    expect(token).toBeNull();
  });
});
