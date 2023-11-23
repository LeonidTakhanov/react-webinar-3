import { createElement } from "./utils.js";
/**
 * Хранилище состояния приложения
 */
class Store {
  constructor(initState = {}) {
    this.state = { ...initState, selectedElement: null };
    this.listeners = []; // Слушатели изменений состояния
    this.usedNumbers = new Set();
    this.currentNumber = 8;
    this.selectionCounts = {};
  }

  getSelectedElement() {
    return this.state.selectedElement;
  }

  generateUniqueNumber() {
    if (this.currentNumber > 200) {
      return null;
    }

    while (this.usedNumbers.has(this.currentNumber)) {
      this.currentNumber++;
      if (this.currentNumber > 200) {
        return null;
      }
    }

    this.usedNumbers.add(this.currentNumber);
    return this.currentNumber++;
  }

  /**
   * Подписка слушателя на изменения состояния
   * @param listener {Function}
   * @returns {Function} Функция отписки
   */
  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  /**
   * Выбор состояния
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка состояния
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Вызываем всех слушателей
    for (const listener of this.listeners) listener();
  }

  /**
   * Добавление новой записи
   */
  addItem() {
    const randomNumber = this.generateUniqueNumber();
    if (randomNumber !== null) {
      const newItem = {
        code: randomNumber,
        title: "Новая запись",
      };

      this.setState({
        ...this.state,
        list: [...this.state.list, newItem],
      });
    }
  }

  /**
   * Удаление записи по коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      list: this.state.list.filter((item) => item.code !== code),
    });
  }

  /**
   * Выделение записи по коду
   * @param code
   */
  selectItem(code) {
    const selectionText = `Выделяли ${this.selectionCounts[code]} раз`;
    const selectedElement = createElement(
      "div",
      { className: "selection-count" },
      selectionText
    );

    const updatedList = this.state.list.map((item) => {
      if (item.code === code) {
        item.selected = !item.selected;
        this.selectionCounts[code] = this.selectionCounts[code] || 0;
        this.selectionCounts[code]++;
        item.selectionCount = this.selectionCounts[code];
      } else {
        item.selected = false;
        item.selectionCount = this.selectionCounts[item.code];
      }
      return item;
    });

    this.setState({
      ...this.state,
      list: updatedList,
      selectedElement: selectionText,
    });
  }
}

export default Store;
