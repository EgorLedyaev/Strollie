# ActionTouchable

`ActionTouchable` — общий обёрточный компонент над `Pressable`, который даёт единое анимированное визуальное подтверждение действий. Используйте его для текстовых или иконковых кнопок, когда нужен быстрый отклик без полноценного `AppButton`.

## Когда использовать

- Кнопки «ссылочного» формата в меню, поповерах и карточках.
- Иконки с кастомной подложкой, где хочется получить затемнение или плавное изменение прозрачности.
- Сценарии, где логика нажатия уже управляется родителем, а нужен только единый touch-feedback.

## Основные пропсы

- `feedback` (`'overlay' | 'opacity'`, по умолчанию `'overlay'`) — выбирает тип визуальной обратной связи.
  - `overlay` накладывает полупрозрачный слой поверх детей.
  - `opacity` уменьшает прозрачность содержимого. Совместимо с текстовыми ссылками.
- `opacity` (`number`, по умолчанию `0.3`) — сила эффекта для режима `opacity`.
- Любые остальные пропсы `Pressable` (`onPress`, `disabled`, `hitSlop` и т.д.).
- `children` — узел или функция, получающая стандартное `PressableStateCallbackType`.

## Примеры

### Ссылка в поповере

```tsx
<ActionTouchable onPress={onEdit} feedback='opacity' style={styles.menuItem}>
  <AppText style={styles.menuText}>Редактировать</AppText>
</ActionTouchable>
```

### Иконка с затемнением

```tsx
<ActionTouchable onPress={onToggle} style={styles.square}>
  <EditPhotoIcon color={iconColor} />
</ActionTouchable>
```

### Функциональный ребёнок

```tsx
<ActionTouchable onPress={onDelete}>
  {({ pressed }) => (
    <View style={[styles.row, pressed && styles.rowPressed]}>
      <DeleteIcon />
      <AppText>Удалить</AppText>
    </View>
  )}
</ActionTouchable>
```

## Рекомендации

- Для больших CTA продолжайте использовать `AppButton` — он управляет типографикой и размерами.
- Старайтесь применять `feedback='opacity'` для текстовых «ссылок», чтобы не затемнять фон компонента.
- Если передаёте функцию-ребёнка, не забывайте пробрасывать `pressed` на свои стили — это позволяет поддерживать дополнительные эффекты.
