import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionSummary,
  Avatar,
  Box,
  Typography,
  AccordionDetails,
  SvgIcon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { useState } from 'react'
import type { ReactElement } from 'react'
import Question from '@/public/images/common/question.svg'
import css from './styles.module.css'
import { trackEvent } from '@/services/analytics'
import { WALLETCONNECT_EVENTS } from '@/services/analytics/events/walletconnect'
import { useTranslation } from 'react-i18next'

const HintAccordion = ({
  title,
  items,
  expanded,
  onExpand,
}: {
  title: string
  items: Array<string>
  expanded: boolean
  onExpand: () => void
}): ReactElement => {
  return (
    <Accordion onClick={onExpand} expanded={expanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={css.title}>
          <SvgIcon component={Question} inheritViewBox className={css.questionIcon} />
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <List className={css.list}>
          {items.map((item, i) => (
            <ListItem key={i} sx={{ p: 0 }}>
              <ListItemAvatar className={css.listItemAvatar}>
                <Avatar className={css.avatar}>{i + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={item} sx={{ m: 0 }} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

const WcHints = (): ReactElement => {
  const { t } = useTranslation()
  const [expandedAccordion, setExpandedAccordion] = useState<'connection' | 'interaction' | null>(null)

  const onExpand = (accordion: 'connection' | 'interaction') => {
    setExpandedAccordion((prev) => {
      return prev === accordion ? null : accordion
    })

    trackEvent(WALLETCONNECT_EVENTS.HINTS_EXPAND)
  }

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <HintAccordion
        title={t('walletconnect.connectionTitle')}
        items={[
          t('walletconnect.connectionStep1'),
          t('walletconnect.connectionStep2'),
          t('walletconnect.connectionStep3'),
          t('walletconnect.connectionStep4'),
          t('walletconnect.connectionStep5'),
          t('walletconnect.connectionStep6'),
        ]}
        onExpand={() => onExpand('connection')}
        expanded={expandedAccordion === 'connection'}
      />
      <HintAccordion
        title={t('walletconnect.interactionTitle')}
        items={[
          t('walletconnect.interactionStep1'),
          t('walletconnect.interactionStep2'),
          t('walletconnect.interactionStep3'),
          t('walletconnect.interactionStep4'),
        ]}
        onExpand={() => onExpand('interaction')}
        expanded={expandedAccordion === 'interaction'}
      />
    </Box>
  )
}

export default WcHints
