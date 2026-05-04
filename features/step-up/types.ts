export type StepUpAction = 'DELETE_ACCOUNT';

export interface StepUpStartResponse {
  challengeId: string;
  ttlMinutes: number;
}
