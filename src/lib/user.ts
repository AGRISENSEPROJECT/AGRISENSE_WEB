type UserLike = {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  displayName?: string | null;
  email?: string | null;
  deleted?: boolean | null;
  banned?: boolean | null;
  deletedAt?: string | null;
  status?: string | null;
};

export function isDeletedAccount(user?: UserLike | null): boolean {
  if (!user) return false;
  if (user.deleted || user.deletedAt) return true;
  const label = `${user.displayName || ""} ${user.username || ""}`.toLowerCase();
  return label.includes("deleted account");
}

export function isBannedAccount(user?: UserLike | null): boolean {
  if (!user || isDeletedAccount(user)) return false;
  if (user.banned) return true;
  if (String(user.status || "").toUpperCase() === "BANNED") return true;
  const label = `${user.displayName || ""} ${user.username || ""}`.toLowerCase();
  return label.includes("banned account");
}

export function getUserDisplayName(user?: UserLike | null): string {
  if (!user) return "Guest";
  if (isDeletedAccount(user)) return "Deleted account";
  if (isBannedAccount(user)) return "Banned account";

  const fullName = [user.firstName, user.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  if (fullName) return fullName;

  const username = user.username?.trim();
  if (username) return username;

  const display = user.displayName?.trim();
  if (display) return display;

  const email = user.email?.trim();
  return email || "Guest";
}
