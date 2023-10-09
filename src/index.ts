import fs from 'fs/promises'
import XLSX from 'xlsx'

import env from './env'

//
;(async () => {
  try {
    const spreadSheetPath = env.SPREADSHEET_PATH
    const jsonPath = env.OUTPUT_FILE

    // verify files
    if (!(await fileExists(spreadSheetPath))) {
      throw Error(`Gwent card spreadsheet "${spreadSheetPath}" does not exist or is not accessible.`)
    }
    if (await fileExists(jsonPath)) {
      await fs.rm(jsonPath)
    }

    // verify spreadsheet
    const workbook = await XLSX.readFile(spreadSheetPath)
    if (!workbook.SheetNames.includes(SHEET_NAMES.Cards)) {
      throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${SHEET_NAMES.Cards}"`)
    }
    if (!workbook.SheetNames.includes(SHEET_NAMES.Types)) {
      throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${SHEET_NAMES.Types}"`)
    }

    // convert XSLX to JSON
    const cardSheet = workbook.Sheets[SHEET_NAMES.Cards]
    const json = XLSX.utils.sheet_to_json(cardSheet)

    // write JSON to file
    await fs.writeFile(env.OUTPUT_FILE, JSON.stringify(json, null, 2))
  } catch (err: unknown) {
    console.error(err)
    process.exit(1)
  }
})()

async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
  } catch (err: unknown) {
    return false
  }
  return true
}

enum SHEET_NAMES {
  Cards = 'Cards',
  Types = 'Types',
}
