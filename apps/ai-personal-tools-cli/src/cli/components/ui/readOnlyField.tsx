import { Box, Text } from 'ink'



type ReadOnlyFieldPropsT = {
  label: string
  value: string
}


export const ReadOnlyField = ({
  label,
  value,
}: ReadOnlyFieldPropsT) => {

  return (
    <Box flexDirection="column">
      <Box
        flexDirection="row"
        // borderColor="gray"
        // borderStyle="round"
        // minHeight={3}
        paddingX={1}
        // gap={1}
      >
        <Text dimColor>{label}:</Text>
        <Text dimColor>{value}</Text>
      </Box>
    </Box>
  )
}

