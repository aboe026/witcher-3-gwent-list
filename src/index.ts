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
    if (!workbook.SheetNames.includes(SHEET_NAMES.Types)) {
      throw Error(`Spreadsheet "${spreadSheetPath}" does not contain sheet "${SHEET_NAMES.Types}"`)
    }

    // convert XSLX to JSON
    const cardSheet = workbook.Sheets[SHEET_NAMES.Cards]
    const cardJson = XLSX.utils.sheet_to_json(cardSheet)
    const factionSheet = workbook.Sheets[SHEET_NAMES.Factions]
    const factionJson = XLSX.utils.sheet_to_json(factionSheet)

    // write JSON to file
    const cardJsonFile = path.join(env.OUTPUT_DIRECTORY, 'cards.json')
    const factionJsonFile = path.join(env.OUTPUT_DIRECTORY, 'factions.json')
    if (await fileExists(cardJsonFile)) {
      await fs.rm(cardJsonFile)
    }
    if (await fileExists(factionJsonFile)) {
      await fs.rm(factionJsonFile)
    }
    await fs.writeFile(cardJsonFile, JSON.stringify(cardJson, null, 2))
    await fs.writeFile(factionJsonFile, JSON.stringify(factionJson, null, 2))
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
  Factions = 'Factions',
  Types = 'Types',
}
