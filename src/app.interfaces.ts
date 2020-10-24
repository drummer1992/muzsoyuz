export enum Instruments {
	GUITAR   = 'guitar',
	DRUMS    = 'drums',
	VOICE    = 'voice',
	BAS      = 'bas',
	KEYS     = 'keys',
	SAX      = 'sax',
	PANDORA  = 'pandora',
	VIOLIN   = 'violin',
	TRUMPET  = 'trumpet',
	TROMBONE = 'trombone',
	BAND     = 'band',
	OTHER    = 'other',
}

export enum Gender {
	M = 'm',
	F = 'f',
}

export enum UserTypes {
	MUSICIAN    = 'musician',
	MANAGER     = 'manager',
	TEACHER     = 'teacher',
	STUDENT     = 'student',
	MERE_MORTAL = 'mereMortal'
}

export enum JobTypes {
	MUSICAL_REPLACEMENT = 'musicalReplacement',
	SELF_PROMOTION      = 'selfPromotion',
}

export type ProviderAttributes = 'googleId' | 'facebookId'