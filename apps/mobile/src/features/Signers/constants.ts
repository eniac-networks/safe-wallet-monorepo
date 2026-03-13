import { SignerSection } from './components/SignersList/SignersList'

export const groupedSigners: Record<string, SignerSection> = {
  imported: {
    id: 'imported_signers',
    title: 'signers.mySigners',
    data: [],
  },
  notImported: {
    id: 'not_imported_signers',
    title: 'signers.notImportedSigners',
    data: [],
  },
}
