import { login } from "../src/js/api/auth/login.js";
import { apiPath } from "../src/js/api/constants.js";
import { headers } from "../src/js/api/headers.js";
import * as storage from "../src/js/storage/index.js";

// Mock the global fetch function
global.fetch = jest.fn();

// Mock the storage module
jest.mock("../src/js/storage/index.js", () => ({
  save: jest.fn(),
  load: jest.fn(),
}));

describe("login function", () => {
  const email = "user@example.com";
  const password = "password123";
  const mockAccessToken = "mockUserToken";
  const mockProfile = {
    name: "John Doe",
    email: "john@example.com",
    accessToken: mockAccessToken,
  };

  // Reset all mock functions before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Log in successfully, save the token, and return the profile without the token", async () => {
    // Mock a successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfile,
    });

    const result = await login(email, password);

    // Verify that fetch was called with correct arguments
    expect(fetch).toHaveBeenCalledWith(`${apiPath}/social/auth/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: headers("application/json"),
    });

    // Verify that the token and profile were saved correctly
    expect(storage.save).toHaveBeenCalledWith("token", mockAccessToken);
    expect(storage.save).toHaveBeenCalledWith("profile", {
      name: "John Doe",
      email: "john@example.com",
    });

    // Verify that the returned result doesn't include the access token
    expect(result).toEqual({
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("Error if the login fails with a 401 Unauthorized", async () => {
    // Mock an unsuccessful API response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    // Verify that the login function throws an "Unauthorized" error
    await expect(login(email, "wrongPassword")).rejects.toThrow("Unauthorized");

    // Verify that no data was saved to storage
    expect(storage.save).not.toHaveBeenCalled();
  });

  it("Network error if the fetch request fails", async () => {
    // Mock a network error
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    // Verify that the login function throws a "Network Error"
    await expect(login(email, password)).rejects.toThrow("Network Error");

    // Verify that no data was saved to storage
    expect(storage.save).not.toHaveBeenCalled();
  });
});
