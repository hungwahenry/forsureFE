export type StepUpAction = 'DELETE_ACCOUNT' | 'CHANGE_EMAIL';

export interface StepUpStartResponse {
  challengeId: string;
  ttlMinutes: number;
}
