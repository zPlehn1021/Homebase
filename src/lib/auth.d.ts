// Custom session type for Homebase auth
// Used via `as HomebaseSession` cast since module augmentation
// doesn't work with nested @auth/core in next-auth

export interface HomebaseUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  purchaseVerified: boolean;
  onboardingCompleted: boolean;
  propertyType: string | null;
  squareFootage: number | null;
}

export interface HomebaseSession {
  user: HomebaseUser;
  expires: string;
}
