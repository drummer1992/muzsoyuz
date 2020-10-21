export enum Instrument {
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

export enum UserType {
	MUSICIAN    = 'musician',
	MANAGER     = 'manager',
	TEACHER     = 'teacher',
	STUDENT     = 'student',
	MERE_MORTAL = 'mereMortal'
}

export enum FeedType {
	MUSICAL_REPLACEMENT = 'musicalReplacement',
	SELF_PROMOTION      = 'selfPromotion',
	JOB                 = 'job'
}

export type ProviderAttribute = 'googleId' | 'facebookId'