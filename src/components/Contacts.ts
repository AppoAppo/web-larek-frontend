import { IOrderContacts } from '../types';
import { ORDER_CONTACTS_FIELDS } from '../utils/constants';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Contacts extends Form<IOrderContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(
			this.container.elements.namedItem(
				ORDER_CONTACTS_FIELDS.phone
			) as HTMLInputElement
		).value = value;
	}

	set email(value: string) {
		(
			this.container.elements.namedItem(
				ORDER_CONTACTS_FIELDS.email
			) as HTMLInputElement
		).value = value;
	}
}
