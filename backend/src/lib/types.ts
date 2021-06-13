export type CallUserEventData = {
	[key in 'offer' | 'answer']: RTCSessionDescriptionInit;
} & {
	to: string;
};

export type SocketUser = {
	id: string;
	name?: string;
	isOnCall: boolean;
};
