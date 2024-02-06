import {afterAll, describe, expect, test} from '@jest/globals';
import * as Syrenity from "../src/index";
import options from "./options.json";

const client = new Syrenity.Client();

describe("Testing permission functions", () => {
  let role: Syrenity.Role = null as unknown as Syrenity.Role;

  beforeAll(async () => {
    await client.loginWithoutWebsockets(options.token);
    role = await client.guild(58).role(932).fetch();
  });

  test("Expect permissions", async () => {
    expect(
      role.permissions.bitfield
    ).toBe(261632)
  });

  test("Has SEND_MESSAGES", async () => {
    expect(
      role.permissions.hasPermission("CREATE_MESSAGE")
    ).toBe(true)
  });

  test("Member has SEND_MESSAGES", async () => {
    expect(
      (await client.guild(58).members
        .fetchList())
        .find(x => x.user.id === 58)
        ?.permissions.hasPermission("CREATE_MESSAGE")
    ).toBe(true)
  });

  test("Has ADMINISTRATOR", async () => {
    expect(
      role.permissions.hasPermission("ADMINISTRATOR")
    ).toBe(false)
  });
});