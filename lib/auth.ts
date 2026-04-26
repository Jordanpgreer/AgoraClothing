import "server-only";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "agora_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "agora-admin";
}

export async function isAuthed() {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === "1";
}
