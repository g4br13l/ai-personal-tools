import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'



const Pointer = '›'



export type ItemT<TValue> = {
  key?: string
  label: string
  value: TValue
}

export type SelectFieldPropsT<TValue> = {
  items: ItemT<TValue>[]
  label?: string
  onSelectFn?: (item: ItemT<TValue>) => void
  isFocused?: boolean
  valueFilled?: TValue
}


export function SelectField<TValue>({
  items,
  label,
  onSelectFn,
  isFocused = false,
  valueFilled,
}: SelectFieldPropsT<TValue>) {

  const initialIndex = items.findIndex((item) => item.value === valueFilled)
  const focusColor = 'cyanBright'

  return (

    <Box flexDirection="column">
      <Text>{label}:</Text>
      <Box
        flexDirection="column"
        borderDimColor={!isFocused}
        {...(isFocused ? { borderColor: focusColor } : {})}
        borderStyle="round"
        minHeight={3}
        paddingX={1}
      >
        <SelectInput
          items={items}
          onSelect={(item) => onSelectFn?.(item)}
          initialIndex={initialIndex >= 0 ? initialIndex : 0}
          isFocused={isFocused}
          indicatorComponent={({ isSelected }) => (
            <Box marginRight={1}>
              {isSelected
                ? (<Text {...(isFocused ? { color: focusColor } : {})}>{Pointer}</Text>)
                : (<Text> </Text>)}
            </Box>
          )}
          itemComponent={({ isSelected, label: itemLabel }) => {
            const itemColor = isFocused ? focusColor : undefined
            return (
              <Text color={itemColor} dimColor={!isSelected}>
                {itemLabel}
              </Text>
            )
          }}
        />
      </Box>
    </Box>

  )
}
