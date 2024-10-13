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

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("Successfully save the token", async () => {
    // Mock a successful API response
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProfile),
    });

    await login(email, password);

    const token = localStorage.getItem("token");
    const accessToken = JSON.parse(token);

    expect(accessToken).toEqual(mockAccessToken);
  });

  it("Deletes the token successfully", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProfile),
    });

    await login(email, password);
    logout();

    const token = localStorage.getItem("token");

    expect(token).toBeNull();
  });
});
