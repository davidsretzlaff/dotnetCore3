import { Lot  } from './Lot';
import { SocialNetworks } from './SocialNetworks';
import { Speaker } from './Speaker';

export interface Event {
    id: number;
    place: string;
    eventDate: Date;
    theme: string;
    quantity: number;
    imageURL: string;
    phone: string;
    email: string;
    lots: Lot[];
    socialNetworks: SocialNetworks[];
    speakerEvents: Speaker[];
}
