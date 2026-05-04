export interface BlockedUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  blockedAt: string;
}

export interface BlockedListResponse {
  items: BlockedUser[];
}
