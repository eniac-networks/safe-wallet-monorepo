import TxCard from '@/components/tx-flow/common/TxCard'
import { Grid2 as Grid, Stack, StepIcon, Typography } from '@mui/material'
import ExternalLink from '@/components/common/ExternalLink'
import { type PropsWithChildren, useContext, useMemo } from 'react'
import { SafeTxContext } from '@/components/tx-flow/SafeTxProvider'
import useTxPreview from '../confirmation-views/useTxPreview'
import Track from '@/components/common/Track'
import { MODALS_EVENTS } from '@/services/analytics'
import useWallet from '@/hooks/wallets/useWallet'
import { isHardwareWallet, isLedgerLive } from '@/utils/wallets'
import { TxFlowStep } from '@/components/tx-flow/TxFlowStep'
import { Receipt } from '../ConfirmTxDetails/Receipt'
import { Slot, SlotName } from '@/components/tx-flow/slots'
import { Sign } from '@/components/tx-flow/actions/Sign'
import { useTranslation } from 'react-i18next'

export const ConfirmTxReceipt = ({ children, onSubmit }: PropsWithChildren<{ onSubmit: () => void }>) => {
  const { t } = useTranslation()
  const { safeTx } = useContext(SafeTxContext)
  const [txPreview] = useTxPreview(safeTx?.data)
  const wallet = useWallet()
  const showHashes = wallet ? isHardwareWallet(wallet) || isLedgerLive(wallet) : false

  const InfoSteps = useMemo(
    () => [
      {
        label: t('confirmTx.reviewWhatToSign'),
        description: (
          <Typography>
            {t('confirmTx.signingIrreversible')}{' '}
            <Track {...MODALS_EVENTS.SIGNING_ARTICLE}>
              <ExternalLink href="https://help.safe.global/en/articles/276343-how-to-perform-basic-transactions-checks-on-safe-wallet">
                {t('confirmTx.readMore')}
              </ExternalLink>
            </Track>
            .
          </Typography>
        ),
      },
      {
        label: t('confirmTx.compareWithWallet'),
        description: <Typography>{t('confirmTx.onceYouClickSign')}</Typography>,
      },
      {
        label: t('confirmTx.verifyWithTools'),
        description: (
          <Typography>
            {t('confirmTx.verifyDesc')}{' '}
            <Track {...MODALS_EVENTS.OPEN_SAFE_UTILS}>
              <ExternalLink href="https://safeutils.openzeppelin.com/">Safe Utils</ExternalLink>
            </Track>
            .
          </Typography>
        ),
      },
    ],
    [t],
  )

  const HardwareWalletStep = useMemo(
    () => [
      InfoSteps[1],
      {
        label: t('confirmTx.compareWithDevice'),
        description: <Typography>{t('confirmTx.hardwareWalletDesc')}</Typography>,
      },
      InfoSteps[2],
    ],
    [t, InfoSteps],
  )

  const steps = showHashes ? HardwareWalletStep : InfoSteps

  if (!safeTx) {
    return false
  }

  return (
    <TxFlowStep title={t('confirmTx.reviewDetails')} fixedNonce>
      <TxCard>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack px={1} gap={6}>
              {steps.map(({ label, description }, index) => (
                <Stack key={index} spacing={2} direction="row">
                  <StepIcon icon={index + 1} active />
                  <Stack spacing={1}>
                    <Typography fontWeight="bold">{label}</Typography>
                    {description}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Receipt safeTxData={safeTx?.data} txData={txPreview?.txData} txInfo={txPreview?.txInfo} />
          </Grid>
        </Grid>

        {children}

        <Slot name={SlotName.Submit} onSubmitSuccess={onSubmit}>
          <Sign
            onSubmitSuccess={onSubmit}
            options={[{ id: 'sign', label: t('safeMessages.sign') }]}
            onChange={() => {}}
            slotId="sign"
          />
        </Slot>
      </TxCard>
    </TxFlowStep>
  )
}
