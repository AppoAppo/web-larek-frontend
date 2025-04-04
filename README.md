# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

Вот обновленная документация с единой стилизацией в формате Markdown. Я унифицировал заголовки, отступы, выделение кода и структуру для всех разделов:

---

# Данные и типы данных

## Данные товара

```typescript
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

## Состояние приложения

```typescript
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
}
```

## Данные платежа

```typescript
export interface IOrderPayment {
	payment: PaymentStatus;
	address: string;
}
```

## Контактные данные

```typescript
export interface IOrderContacts {
	email: string;
	phone: string;
}
```

## Объединенная форма заказа

```typescript
type IOrderForm = IOrderPayment & IOrderContacts;
```

## Итоговый набор данных для заказа

```typescript
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}
```

## Ответные данные после заказа

```typescript
export interface IOrderResult {
	id: string;
	total: number;
}
```

## Ошибки валидации форм

```typescript
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

---

# Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- **Слой представления**: Отвечает за отображение данных на странице.
- **Слой данных**: Управляет хранением и изменением данных.
- **Презентер**: Обеспечивает связь между представлением и данными.

---

## Базовый код

### Класс `Api`

Базовая логика отправки запросов.

- **Конструктор**: Принимает базовый адрес сервера и опциональные заголовки.
- **Методы**:
  - `get`: Выполняет GET-запрос, возвращает промис с ответом сервера.
  - `post`: Отправляет данные в JSON на указанный ендпоинт (по умолчанию POST, метод переопределяем).

### Класс `EventEmitter`

Брокер событий для отправки и подписки на события.

- **Интерфейс `IEvents`**:
  - `on`: Подписка на событие.
  - `emit`: Инициализация события.
  - `trigger`: Возвращает функцию для генерации события.
  - `onAll`, `offAll`: Служебные методы для отладки.

---

## Слой данных

### Класс `AppState`

Управляет состоянием приложения.

#### Свойства

- `basket: IProduct[]` — Товары в корзине.
- `catalog: IProduct[]` — Список товаров в каталоге.
- `order: Partial<IOrderPayment>` — Данные оплаты.
- `contacts: Partial<IOrderContacts>` — Контактные данные.
- `preview: string | null` — ID товара для превью.
- `formErrors: FormErrors` — Ошибки валидации.

#### Методы

- **`addToBasket(item: IProduct)`**: Добавляет товар в корзину, вызывает `card-product:presence`.
- **`removeFromBasket(item: IProduct)`**: Удаляет товар из корзины, вызывает `card-product:presence`.
- **`setCatalog(items: IProduct[])`**: Обновляет каталог, вызывает `items:changed`.
- **`setPreview(item: IProduct)`**: Устанавливает товар для превью, вызывает `preview:changed`.
- **`setOrderField(field: keyof IOrderPayment, value: string)`**: Обновляет поле заказа.
- **`validateOrder()`**: Проверяет валидность заказа, вызывает `formErrors.order:change`.
- **`setContactField(field: keyof IOrderContacts, value: string)`**: Обновляет поле контактов.
- **`validateContact()`**: Проверяет валидность контактов, вызывает `formErrors.contact:change`.
- **`clearBasket()`**: Очищает корзину.

#### Геттер

- **`orderData: IOrder`**: Возвращает объект заказа с полями `payment`, `address`, `email`, `phone`, `total`, `items`.

#### События

- `card-product:presence` — Изменение состава корзины.
- `items:changed` — Обновление каталога.
- `preview:changed` — Изменение превью.
- `order:ready` — Данные заказа заполнены.
- `contacts:ready` — Контакты заполнены.
- `formErrors.*:change` — Ошибки валидации.

---

## Слой представления

### Класс `Component<T>`

Базовый класс для компонентов.

- **Конструктор**: Принимает контейнер (DOM-элемент).
- **Метод `render`**: Обновляет данные через сеттеры, возвращает контейнер.

### Класс `Modal`

Реализует модальное окно.

- **Конструктор**: `constructor(selector: string, events: IEvents)`.
- **Поля**:
  - `_content: HTMLElement` — Контент модального окна.
  - `_closeButton: HTMLButtonElement` — Кнопка закрытия.
- **Методы**:
  - `open`: Открывает модалку.
  - `close`: Закрывает модалку (по Esc, клику на оверлей или крестик).

### Класс `Form<T>`

Управляет HTML-формой.

- **Поля**:
  - `_submit: HTMLButtonElement` — Кнопка отправки.
  - `_errors: HTMLElement` — Контейнер ошибок.
  - `container: HTMLFormElement` — Элемент формы.
  - `events: IEvents` — Система событий.
- **Конструктор**: Инициализирует форму, добавляет обработчики `input` и `submit`.
- **Методы**:
  - `onInputChange(field: keyof T, value: string)`: Эмитит событие `${имя_формы}.${поле}:change`.
  - `render(state: Partial<T> & IFormState)`: Обновляет форму (валидность, ошибки, значения).
- **Сеттеры**:
  - `valid: boolean` — Управляет активностью кнопки.
  - `errors: string` — Устанавливает текст ошибок.
- **События**:
  - `${formName}:submit` — Попытка отправки формы.
  - `${formName}.${field}:change` — Изменение поля.

### Класс `Card`

Карточка товара.

- **Поля**:
  - `_title: HTMLElement` — Заголовок.
  - `_price: HTMLElement` — Цена.
  - `_button?: HTMLButtonElement` — Кнопка (опционально).
- **Свойства**:
  - `id`: Устанавливает/получает `data-id`.
  - `title`: Устанавливает/получает текст заголовка.
  - `price`: Форматирует цену (`${value} синапсов` или `Бесценно`).

### Класс `Success`

Отображение успешного результата.

- **Поля**:
  - `_close: HTMLElement` — Кнопка закрытия.
  - `_total: HTMLElement` — Сумма.
- **Свойства**:
  - `total`: Устанавливает текст суммы.

### Класс `CardInCatalog`

Карточка для каталога.

- **Поля**:
  - `_category: HTMLElement` — Категория.
  - `_image?: HTMLImageElement` — Изображение.
- **Свойства**:
  - `category`: Устанавливает текст и класс категории.
  - `image`: Устанавливает изображение (`.png`).

### Класс `CardInModal`

Карточка в модальном окне.

- **Поля**:
  - `_description?: HTMLElement` — Описание.
  - `_buttonText: string` — Текст кнопки.
- **Свойства**:
  - `buttonText`: Устанавливает/получает текст кнопки.
  - `description`: Устанавливает описание.

### Класс `CardInBasket`

Карточка в корзине.

- **Поля**:
  - `_itemIndex: HTMLElement` — Индекс.
- **Свойства**:
  - `itemIndex`: Устанавливает номер позиции.

### Класс `Contacts`

Форма контактов.

- **Свойства**:
  - `phone`: Устанавливает значение телефона.
  - `email`: Устанавливает значение email.

### Класс `Order`

Форма оплаты.

- **Поля**:
  - `_buttonCash: HTMLButtonElement` — Кнопка наличных.
  - `_buttonCard: HTMLButtonElement` — Кнопка карты.
- **Свойства**:
  - `payment`: Устанавливает способ оплаты (класс `button_alt-active`).
  - `address`: Устанавливает адрес.

### Класс `Page`

Управление страницей.

- **Поля**:
  - `_counter: HTMLElement` — Счетчик корзины.
  - `_catalog: HTMLElement` — Каталог.
  - `_basket: HTMLElement` — Кнопка корзины.
  - `_wrapper: HTMLElement` — Обертка.
- **Свойства**:
  - `counter`: Устанавливает счетчик.
  - `catalog`: Обновляет каталог.
  - `locked`: Блокирует/разблокирует прокрутку.

---

## Слой коммуникации

### Класс `LarekAPI`

API для работы с бэкендом.

- **Поля**:
  - `cdn: string` — Адрес CDN.
- **Методы**:
  - `getProductItem(id: string)`: Получает продукт по ID.
  - `getProductList()`: Получает список продуктов.
  - `orderProducts(order: IOrder)`: Отправляет заказ.

---

## Взаимодействие компонентов

Презентер (`index.ts`) связывает представление и данные через события `EventEmitter`.  
Экземпляры классов создаются, затем настраиваются обработчики событий.

### Список событий

1. **`initialData:loaded`**  
   Заполняет каталог после загрузки данных.
2. **`card:select`**  
   Устанавливает товар для превью.
3. **`basket:open`**  
   Открывает корзину в модальном окне.
4. **`card-product:presence`**  
   Обновляет текст кнопки в зависимости от корзины.
5. **`card:delete`**  
   Удаляет товар из корзины.
6. **`card-product:button`**  
   Добавляет/удаляет товар из корзины.
7. **`preview:changed`**  
   Отображает или скрывает превью.
8. **`order:submit`**  
   Открывает форму контактов.
9. **`contacts:submit`**  
   Отправляет заказ, показывает успех.
10. **`formErrors.order:change`**  
    Обновляет валидацию формы оплаты.
11. **`formErrors.contact:change`**  
    Обновляет валидацию формы контактов.
12. **`/^order\..*:change/`**  
    Обновляет данные формы оплаты.
13. **`/^contacts\..*:change/`**  
    Обновляет данные формы контактов.
14. **`order:open`**  
    Открывает форму оплаты.
15. **`modal:open`**  
    Блокирует прокрутку страницы.
16. **`modal:close`**  
    Разблокирует прокрутку страницы.
