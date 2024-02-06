import {afterAll, describe, expect, test} from '@jest/globals';
import * as Syrenity from "../src/index";

const client = new Syrenity.Client();

describe("Testing user functions", () => {
  beforeAll(async () => {
    await client.loginWithoutWebsockets(
      "NTg=.MTcwNDU3MzEzOTYuNDM=.OWI2YjEyYWUtMGQyNS00ODM5LTlmN2YtYWMxMmY3MGNkOWM2"
    );
  });

  test("Get current user", async () => {
    expect(
      await client.currentUser.fetch()
    ).toBeInstanceOf(Syrenity.User)
  });

  test("Get other user (33)", async () => {
    expect(
      await client.user(33).fetch()
    ).toBeInstanceOf(Syrenity.User);
  });
});