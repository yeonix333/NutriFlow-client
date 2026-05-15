export const CATEGORIES = [
  { value: 'vegetables', label: 'Овочі' },
  { value: 'fruits', label: 'Фрукти' },
  { value: 'meat', label: "М'ясо" },
  { value: 'fish', label: 'Риба' },
  { value: 'dairy', label: 'Молочні' },
  { value: 'grains', label: 'Крупи' },
  { value: 'legumes', label: 'Бобові' },
  { value: 'nuts', label: 'Горіхи' },
  { value: 'sweets', label: 'Солодощі' },
  { value: 'beverages', label: 'Напої' },
  { value: 'other', label: 'Інше' },
];

export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Сніданок' },
  { value: 'lunch', label: 'Обід' },
  { value: 'dinner', label: 'Вечеря' },
  { value: 'snack', label: 'Перекус' },
];

export const GENDERS = [
  { value: 'male', label: 'Чоловіча' },
  { value: 'female', label: 'Жіноча' },
  { value: 'other', label: 'Інша' },
];

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Малорухливий' },
  { value: 'light', label: 'Легка активність' },
  { value: 'moderate', label: 'Помірна' },
  { value: 'active', label: 'Висока' },
  { value: 'very_active', label: 'Дуже висока' },
];

export const GOALS = [
  { value: 'lose_weight', label: 'Схуднення' },
  { value: 'maintain', label: 'Підтримка ваги' },
  { value: 'gain_weight', label: 'Набір ваги' },
  { value: 'gain_muscle', label: 'Набір м\'язів' },
];

export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function mealTypeLabel(value) {
  return MEAL_TYPES.find((m) => m.value === value)?.label || value;
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}
