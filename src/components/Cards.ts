import { ensureElement } from '../utils/utils';
import { Card, ICardActions } from './common/Card';

export class CardInCatalog extends Card {
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;

	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super('card', container, actions);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._category = container.querySelector(`.${blockName}__category`);
	}

	set category(value: string) {
		let categoryClass = '';
		switch (value) {
			case 'софт-скил':
				categoryClass = 'card__category_soft';
				break;
			case 'другое':
				categoryClass = 'card__category_other';
				break;
			case 'дополнительное':
				categoryClass = 'card__category_additional';
				break;
			case 'кнопка':
				categoryClass = 'card__category_button';
				break;
			case 'хард-скил':
				categoryClass = 'card__category_hard';
				break;
		}
		this._category.classList.value = `card__category ${categoryClass}`;
		this.setText(this._category, value);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set image(value: string) {
		if (this instanceof CardInBasket) return; //TODO
		this.setImage(this._image, value.slice(0, -3) + 'png', this.title);
	}
}

export class CardInModal extends CardInCatalog {
	protected _description?: HTMLElement;
	protected _buttonText: string;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._description = container.querySelector(
			`.${this.blockName}__description`
		);
	}

	set buttonText(text: string) {
		this._buttonText = text;
		this._button.textContent = this._buttonText;
	}

	get buttonText(): string {
		return this._buttonText;
	}

	set description(value: string | string[]) {
		this.setText(this._description, value);
	}
}

export class CardInBasket extends Card {
	protected _itemIndex: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._itemIndex = container.querySelector(`.basket__item-index`);
	}

	set itemIndex(value: number) {
		this.setText(this._itemIndex, value);
	}
}
