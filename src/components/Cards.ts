import { CategoryType } from '../types';
import {
	CATEGORY_CLASS,
	DEFAULT_BLOCK_NAME,
	IMAGE_EXTENSION,
} from '../utils/constants';
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
		super(DEFAULT_BLOCK_NAME, container, actions);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._category = container.querySelector(`.${blockName}__category`);
	}

	set category(value: CategoryType) {
		this._category.classList.value = `card__category ${CATEGORY_CLASS[value]}`;
		this.setText(this._category, value);
	}

	set image(value: string) {
		this.setImage(
			this._image,
			value.slice(0, -3) + IMAGE_EXTENSION,
			this.title
		);
	}
}

export class CardInModal extends CardInCatalog {
	protected _description?: HTMLElement;
	protected _buttonText: string;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(DEFAULT_BLOCK_NAME, container, actions);

		this._description = container.querySelector(
			`.${this.blockName}__description`
		);
	}

	set buttonText(text: string) {
		this._buttonText = text;
		this.setText(this._button, this._buttonText);
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
		super(DEFAULT_BLOCK_NAME, container, actions);
		this._itemIndex = container.querySelector(`.basket__item-index`);
	}

	set itemIndex(value: number) {
		this.setText(this._itemIndex, value);
	}
}
