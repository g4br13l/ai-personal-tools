import { Box, Text } from 'ink'
import { UncontrolledTextInput } from 'ink-text-input'



export type TextFieldPropsT = {
  valueFilled: string
  onSubmitFn?: (item: string) => void
  label?: string
  isFocused?: boolean
}


export function TextField({
  label,
  valueFilled,
  isFocused,
  onSubmitFn,
}: TextFieldPropsT) {

  return (

    <Box flexDirection="column">

      <Text>{label}:</Text>

      <Box
        flexDirection="column"
        borderDimColor={!isFocused}
        {...(isFocused ? { borderColor: 'cyanBright' } : {})}
        borderStyle="round"
        minHeight={3}
      >

        <Text {...(isFocused ? { color: 'cyanBright' } : {})}>
          <UncontrolledTextInput
            initialValue={valueFilled}
            onSubmit={onSubmitFn}
            focus={isFocused}
            showCursor={isFocused}
          />
        </Text>

      </Box>

    </Box>

  )
}
