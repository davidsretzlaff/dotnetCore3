
import { SocialNetworks } from './SocialNetworks';
import { Event} from './Event';

export interface Speaker {
    id: number;
    name: string;
    curse: string;
    imageURL: string;
    phone: string;
    email: string;
    socialNetworks: SocialNetworks[];
    speakerEvents: Event[];
}
