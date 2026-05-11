import { Box, Text } from 'ink'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'



export const IndexCli = () => {
  return (

    <Box flexDirection="column" paddingY={0} rowGap={0}>

      <Gradient name="vice">
        <BigText text="AI Tools" />
      </Gradient>

      <Text color="cyanBright">
        Automate tasks and boost productivity with AI.
      </Text>
    </Box>

  )
}

