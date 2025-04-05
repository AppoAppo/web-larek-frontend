import { CategoryType } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

//виды платежа
export enum PAYMENT_STATUS {
	bycard = 'card',
	bycash = 'cash',
}

//тексты кнопки в модальном окне товара
export enum CARD_MODAL_ACTIONS {
	remove = 'Удалить',
	buy = 'Купить',
}

//доступные категории карточек
export const CATEGORY_CLASS: Record<CategoryType, string> = {
	'софт-скил': 'card__category_soft',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
};

export const DEFAULT_BLOCK_NAME = 'card';
export const IMAGE_EXTENSION = 'png';
export const PAYMENT_FIELD = 'payment';
export const ORDER_ACTIVE_BUTTON_CLASS = 'button_alt-active';
export const BASKET_IS_EMPTY = 'Корзина пуста';
export const TOTAL_MESSAGE = (value: string) => `Списано ${value} синапсов`;
export const PRICE_MESSAGES = {
	WITH_VALUE: (value: string | number) => `${value} синапсов`,
	PRICELESS: 'Бесценно',
} as const;

//поля формы платежа
export enum ORDER_PAYMENT_FIELDS {
	payment = 'payment',
	address = 'address',
}
//поля формы контактов
export enum ORDER_CONTACTS_FIELDS {
	phone = 'phone',
	email = 'email',
}
//ошибки валидации
export enum VALIDATION_ERRORS {
	phone = 'Необходимо указать телефон',
	email = 'Необходимо указать email',
	address = 'Необходимо указать адрес',
	payment = 'Необходимо выбрать вид платежа',
}

export const APP_EVENT_SUBMIT = (value: string) => `${value}:submit`;
export const APP_EVENT_CHANGE = (container: string, field: string) =>
	`${container}.${String(field)}:change`;

export enum APP_EVENTS {
	initialDataLoaded = 'initialData:loaded', // Заполняет каталог после загрузки данных
	itemsChanged = 'items:changed', //Изменены данные в каталоге
	cardSelect = 'card:select', // Устанавливает товар для превью
	basketOpen = 'basket:open', // Открывает корзину в модальном окне
	cardProductPresence = 'card-product:presence', // Обновляет текст кнопки в зависимости от корзины
	cardDelete = 'card:delete', // Удаляет товар из корзины
	cardProductButton = 'card-product:button', // Добавляет/удаляет товар из корзины
	previewChanged = 'preview:changed', // Отображает или скрывает превью
	orderSubmit = 'order:submit', // Открывает форму контактов
	contactsSubmit = 'contacts:submit', // Отправляет заказ, показывает успех
	formErrorsOrderChange = 'formErrors.order:change', // Обновляет валидацию формы оплаты
	formErrorsContactChange = 'formErrors.contact:change', // Обновляет валидацию формы контактов
	orderOpen = 'order:open', // Открывает форму оплаты
	modalOpen = 'modal:open', // Блокирует прокрутку страницы
	modalClose = 'modal:close', // Разблокирует прокрутку страницы
	orderChangePayment = 'order.payment:change', //Изменено поле Вид платежа на форме Заказа
	orderChangeAddress = 'order.address:change', //Изменено поле Адрес на форме Заказа
	orderReady = 'order:ready', //Форма Заказ валидна
	contactsChangeEmail = 'contacts.email:change', //Изменено поле Email на форме Контакты
	contactsChangePhone = 'contacts.phone:change', //Изменено поле телефон на форме Контакты
	contactsReady = 'contacts:ready', //Форма Контакты валидны
}
