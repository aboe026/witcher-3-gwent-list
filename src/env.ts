import { cleanEnv, str } from 'envalid'

export default cleanEnv(process.env, {
  OUTPUT_DIRECTORY: str({
    desc: 'The path on the filesystem to a directory where the JSON representation of the Gwent cards list should be outputted',
    default: 'output',
  }),
  SPREADSHEET_PATH: str({
    desc: 'The path on the filesystem to the Excel spreadsheet file containing Gwent card list',
    default: 'cards.xlsx',
  }),
})
