import { ProxyUserAPIData } from "./ProxyUser.js";

export interface WebhookAPIData {
  id: string;
  proxy_user_id: number;
  proxy_user: ProxyUserAPIData;
  description: string | null;
  channel_id: number;
  server_id: number;
  creator_id: number;
  created_at: Date;
}
