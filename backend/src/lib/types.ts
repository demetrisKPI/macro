export type CallUserEventData = {
	[key in 'offer' | 'answer']: RTCSessionDescriptionInit;
} & {
	to: string;
};
