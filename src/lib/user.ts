type UserLike = {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
};

export function getUserDisplayName(user?: UserLike | null): string {
  if (!user) return "Guest";

  const fullName = [user.firstName, user.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  if (fullName) return fullName;

  const username = user.username?.trim();
  if (username) return username;

  const email = user.email?.trim();
  return email || "Guest";
}
