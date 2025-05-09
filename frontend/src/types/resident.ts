export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum RelationshipType {
  OWNER = 'OWNER',
  SPOUSE = 'SPOUSE',
  CHILD = 'CHILD',
  PARENT = 'PARENT',
  SIBLING = 'SIBLING',
  OTHER = 'OTHER'
}

export interface Resident {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  idCardNumber: string;
  relationshipWithOwner: RelationshipType;
  isOwner: boolean;
  householdId: number;
  householdCode: string;
  createdAt: string;
}

export interface CreateResidentRequest {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  idCardNumber: string;
  relationshipWithOwner: RelationshipType;
  isOwner: boolean;
  householdId: number;
}

export interface UpdateResidentRequest extends Partial<CreateResidentRequest> {
  id: number;
} 