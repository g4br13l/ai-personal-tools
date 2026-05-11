import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import type { CliLayoutContextT } from '../../cli/components/layout/layout.cli'
import { SelectField } from '../../cli/components/ui/selectField'
import { TextField } from '../../cli/components/ui/textField'
import { extractionDepth, WebExtractionCtrl, type ExtractionDepthValueT } from './webExtraction.ctrl'



type ExtractionFlowStepT = 'type' | 'url' | 'confirmation'
type ExtractionResultT = { jobPostingAddedId: string }



export const WebExtractionCli = () => {

  const [extractionType, setExtractionType] = useState<ExtractionDepthValueT>()
  const [url, setUrl] = useState<string>('')
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const [flowStep, setFlowStep] = useState<ExtractionFlowStepT>('type')
  const [progressMsg, setProgressMsg] = useState<string>('Starting...')
  const [extractionResult, setExtractionResult] = useState<ExtractionResultT[] | null>(null)
  const [extractionError, setExtractionError] = useState<string | null>(null)
  const { focusArea } = useOutletContext<CliLayoutContextT>()


  const handleSetExtractionDepth = (value: ExtractionDepthValueT) => {
    setExtractionType(value)
    setFlowStep('url')
  }

  const handleSetUrl = (value: string) => {
    setUrl(value)
    setFlowStep('confirmation')
  }

  const handleSetConfirmation = (value: string) => {
    value = value.toLocaleLowerCase()
    if (value === 'y' || value === 'yes') setIsConfirmed(true)
    else {
      setExtractionType(undefined)
      setUrl('')
      setIsConfirmed(false)
      setFlowStep('type')
    }
  }


  useEffect(() => {

    const runExtraction = async () => {
      try {
        if (!extractionType) return
        const result = await WebExtractionCtrl({
          extDepthValue: extractionType,
          url,
          onProgress: setProgressMsg,
        })
        setExtractionResult(result ?? null)
      }
      catch (err) {
        setExtractionError(err instanceof Error ? err.message : 'Extraction failed')
      }
    }

    if (isConfirmed) runExtraction()
    
  }, [isConfirmed])


  return (

    <Box flexDirection="column" rowGap={1} width="100%">

      <Box flexDirection="column" paddingX={8} rowGap={1}>

        <SelectField
          label="Extraction type"
          items={extractionDepth}
          onSelectFn={(item) => handleSetExtractionDepth(item.value)}
          isFocused={focusArea === 'content' && flowStep === 'type'}
        />

        <TextField
          label="URL"
          valueFilled={url}
          onSubmitFn={handleSetUrl}
          isFocused={focusArea === 'content' && flowStep === 'url'}
        />

        <TextField
          label="Start the extraction? [y/n]"
          valueFilled="y"
          onSubmitFn={handleSetConfirmation}
          isFocused={focusArea === 'content' && flowStep === 'confirmation'}
        />

        <Box flexDirection="column">
          <Text>Extraction status:</Text>
          {flowStep === 'confirmation' && isConfirmed && !extractionResult && !extractionError && (
            <Text color="cyan">
              <Spinner type="dots12" /> {progressMsg}
            </Text>
          )}
          {extractionResult && (
            <Box flexDirection="column">
              <Text color="green">✓ {extractionResult.length} job(s) extracted</Text>
              {extractionResult.map((r) => (
                <Text key={r.jobPostingAddedId} dimColor>• ID: {r.jobPostingAddedId}</Text>
              ))}
            </Box>
          )}
          {extractionError && (
            <Text color="red">✗ {extractionError}</Text>
          )}
        </Box>

      </Box>

    </Box>

  )
}
