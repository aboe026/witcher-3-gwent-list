import fs from 'fs/promises'
import path from 'path'
import XLSX from 'xlsx'

import env from './env'

//
;(async () => {
  try {
    const spreadSheetPath = env.SPREADSHEET_PATH
    if (!(await fileExists(spreadSheetPath))) {
      throw Error(`Gwent card spreadsheet "${spreadSheetPath}" does not exist or is not accessible.`)
    }

    // verify spreadsheet
    const workbook = await XLSX.readFile(spreadSheetPath)
    if (!workbook.SheetNames.includes(SHEET_NAMES.Cards)) {
      throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${SHEET_NAMES.Cards}"`)
    }
    if (!workbook.SheetNames.includes(SHEET_NAMES.Factions)) {
      throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${SHEET_NAMES.Factions}"`)
    }
    if (!workbook.SheetNames.includes(SHEET_NAMES.Effects)) {
      throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${SHEET_NAMES.Effects}"`)
    }
    if (!workbook.SheetNames.includes(SHEET_NAMES.Types)) {
      throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${SHEET_NAMES.Types}"`)
    }

    // convert XSLX to JSON
    const cardSheet = workbook.Sheets[SHEET_NAMES.Cards]
    const cardJson = XLSX.utils.sheet_to_json(cardSheet)
    const factionSheet = workbook.Sheets[SHEET_NAMES.Factions]
    const factionJson = XLSX.utils.sheet_to_json(factionSheet)
    const effectSheet = workbook.Sheets[SHEET_NAMES.Effects]
    const effectJson = XLSX.utils.sheet_to_json(effectSheet)

    // write JSON to file
    await replaceFile(path.join(env.OUTPUT_DIRECTORY, 'cards.json'), cardJson)
    await replaceFile(path.join(env.OUTPUT_DIRECTORY, 'factions.json'), factionJson)
    await replaceFile(path.join(env.OUTPUT_DIRECTORY, 'effects.json'), effectJson)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function replaceFile(path: string, data: any[]) {
  if (await fileExists(path)) {
    await fs.rm(path)
  }
  await fs.writeFile(path, JSON.stringify(data, null, 2))
}

enum SHEET_NAMES {
  Cards = 'Cards',
  Effects = 'Effects',
  Factions = 'Factions',
  Types = 'Types',
}
